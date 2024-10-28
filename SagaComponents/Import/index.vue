<template>
    <div class="saga-import">
        <div v-if="$slots.default">
            <slot v-bind="{ open }" />
        </div>
        <el-button v-else type="primary" :disabled="disabled" plain @click="open">{{ btnText }}</el-button>
        <el-dialog
            v-model="dialogVisable"
            :title="title"
            :append-to-body="true"
            :close-on-click-modal="false"
            :before-close="handleClose"
            width="600px"
        >
            <div class="saga-import__inner">
                <div v-show="status === 1">
                    <slot name="form" />
                    <el-upload
                        ref="uploader"
                        class="upload-wrap"
                        drag
                        v-model:file-list="fileList"
                        :limit="1"
                        :http-request="handleUpload"
                        :on-exceed="handleExceed"
                        :on-change="handleFileChange"
                        :auto-upload="false"
                    >
                        <i class="el-icon-upload" />
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <template #tip>
                            <div class="el-upload__tip">
                                支持扩展名：.xls .xlsx {{ turnFileSize(uploadLimit) }}以内文件
                                <el-link type="primary" :href="tempUrl" target="_blank">下载模板</el-link>
                            </div>
                        </template>
                    </el-upload>
                </div>
                <div v-show="status === 2" class="upload-progress">
                    <div class="upload-progress__inner">
                        <div class="file-name" :title="file.name">{{ file.name }}</div>
                        <el-progress :stroke-width="10" :percentage="percentage > 100 ? 100 : percentage" />
                    </div>
                </div>
                <div v-show="status === 3" class="upload-result">
                    <div class="upload-result__message">
                        <i :class="result.success ? 'el-icon-ext-success' : 'el-icon-ext-error-outline'" />
                        {{ result.message }}
                    </div>
                    <div class="upload-result__desc" v-html="result.desc" />
                    <div v-if="result.attach" class="download-res-list">
                        <el-link type="primary" target="_blank" :href="result.attach">下载失败记录</el-link>
                    </div>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="handleClose">取 消</el-button>
                    <el-button :loading="loading" type="primary" @click="handleSubmit">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { filesize } from "filesize"
import { isEmpty, cloneDeep } from "lodash-es"
export default {
    name: "SagaImport",
    emits: ["start", "close", "success", "error", "refresh"],
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: "导入"
        },
        btnText: {
            type: String,
            default: "导入"
        },
        uploadTips: {
            type: String,
            default: ""
        },
        queryAction: {
            type: Function
        },
        uploadLimit: {
            type: Number,
            default: 10 * 1024
        },
        fileKey: {
            type: String,
            default: "file"
        },
        action: {
            type: Function,
            required: true
        },
        tempUrl: {
            type: String,
            default: ""
        },
        data: {
            type: Object,
            default: () => {}
        },
        prefixValid: {
            type: Function,
            default: () => null
        }
    },
    data() {
        return {
            loading: false,
            dialogVisable: false,
            status: 1,
            percentage: 0,
            file: {},
            timer: null,
            queryTimer: null,
            result: {
                success: false,
                message: "",
                attach: "",
                desc: ""
            },
            attachData: {},
            fileList: []
        }
    },
    methods: {
        turnFileSize(val) {
            return filesize(val * 1024, { base: 2, standard: "jedec" })
        },
        async handleSubmit() {
            if (this.prefixValid) {
                this.attachData = await this.prefixValid()
            }

            if (this.status === 3) {
                return this.handleClose()
            } else if (isEmpty(this.fileList)) {
                return this.$message.warning("请先选择文件")
            }

            this.loading = true
            this.$refs.uploader.submit()
            this.status = 2
            this.easeProgress()
        },
        handleUpload({ file }) {
            this.file = file
            const formData = new FormData()
            formData.append(this.fileKey, file)

            let attchFormData = cloneDeep(this.data)
            if (this.attachData) {
                attchFormData = Object.assign({}, attchFormData, this.attachData)
            }

            for (const key in attchFormData) {
                formData.set(key, attchFormData[key])
            }
            this.action(formData, {
                disableFailWarning: true
            })
                .then(res => {
                    const data = res.data || {}
                    this.$emit("start")
                    if (data.offline) {
                        this.queryTaskStatus(data.taskId)
                    } else {
                        this.importSuccess(data)
                    }
                })
                .catch(err => {
                    const data = err.data || {}
                    this.$emit("error", data)
                    this.loading = false
                    this.status = 3
                    this.result = {
                        success: false,
                        message: err.msg || data.msg || "导入失败！服务异常！",
                        attach: data.downloadUrl || "",
                        desc: ""
                    }
                })
        },

        handleExceed() {
            this.$message.warning("已存在一个导入文件")
        },

        // 查询离线导入是否完成
        queryTaskStatus(taskId) {
            this.queryAction(taskId).then(({ data }) => {
                if (data.status.value === 2) {
                    this.importSuccess(data)
                } else {
                    // 判断是否失败
                    if (data.status.value === 3) {
                        this.importError(data)
                        return false
                    }
                    this.queryTimer = setTimeout(() => {
                        this.queryTaskStatus(taskId)
                    }, 1000)
                }
            })
        },

        importSuccess(data) {
            this.loading = false
            clearTimeout(this.timer)
            this.percentage = 100
            this.$emit("refresh")
            this.$emit("success", data)
            setTimeout(() => {
                this.status = 3
                this.result = {
                    success: true,
                    message: "导入成功",
                    attach: data.downloadUrl || "",
                    desc: data.taskDesc || ""
                }
            }, 1000)
        },

        importError(data) {
            this.loading = false
            this.$emit("error", data)
            this.status = 3
            this.result = {
                success: false,
                message: data.msg || "导入失败",
                attach: data.downloadUrl || "",
                desc: data.taskDesc || ""
            }
        },
        handleClose() {
            if (this.queryTimer) {
                clearTimeout(this.queryTimer)
            }
            this.file = {}
            this.attachData = {}
            this.status = 1
            this.percentage = 0
            this.clearFiles()
            this.$emit("close")
            this.dialogVisable = false
        },
        clearFiles() {
            //TODO 依赖element+ bug,待完善
            this.fileList = []
            this.$refs.uploader.clearFiles()
        },
        handleFileChange(file) {
            const { name: fileName, size: fileSize } = file
            const ext = fileName.match(/^[^.]*\.{1}(.*)$/)
            if (!ext || !["xls", "xlsx"].includes(ext[1])) {
                this.clearFiles()
                return this.$message.warning("只能上传xlsx/xls格式文件")
            } else if (fileSize > this.uploadLimit * 1024) {
                this.clearFiles()
                return this.$message.warning(`文件大小不能超过${filesize(this.uploadLimit * 1024)}`)
            }
        },
        open() {
            if (this.disabled) {
                return false
            }
            this.dialogVisable = true
        },
        easeProgress() {
            if (this.percentage++ < 89) {
                this.timer = setTimeout(
                    () => {
                        this.easeProgress()
                    },
                    200 + this.percentage * 5
                )
            }
        }
    }
}
</script>

<style lang="scss">
.saga-import {
    display: inline-block;
}
.saga-import__inner {
    .upload-wrap {
        margin-top: 15px;
        text-align: center;
    }
    .upload-progress {
        &__inner {
            text-align: center;
            width: 400px;
            margin: 0 auto;
            padding: 20px 0;
        }
        .file-name {
            margin-bottom: 15px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
    }
    .upload-result__message {
        padding-top: 20px;
        text-align: center;
        font-size: 16px;
        .el-icon-ext-error-outline {
            color: #dd3939;
        }
        .el-icon-ext-success {
            color: #50ad5e;
        }
    }
    .upload-result__desc {
        color: #666;
        margin-top: 10px;
        text-align: center;
    }
    .download-res-list {
        text-align: center;
        margin-top: 10px;
    }
    .el-upload__tip {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
