<template>
    <div class="saga-file-upload">
        <el-upload
            ref="upload"
            v-loading="isRequestIng"
            class="upload-list"
            :limit="limit"
            :http-request="handleUpload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            action="!#"
            :file-list="previewList"
            :on-exceed="handleExceed"
            multiple
        >
            <el-button type="primary">{{ uploadBtnText }}</el-button>
            <template #tip>
                <div class="el-upload__tip">
                    <slot name="tip">
                        {{ tips }}
                    </slot>
                </div>
            </template>
        </el-upload>
    </div>
</template>

<script>
import { cloneDeep } from "lodash-es"
import { formItemContextKey } from "element-plus"

export default {
    name: "SagaFileUpload",
    emits: ["update:modelValue"],
    inject: {
        formItem: formItemContextKey,
        configProvider: "configProvider"
    },
    props: {
        uploadBtnText: {
            type: String,
            default: "点击上传"
        },
        tips: {
            type: String,
            default: ""
        },
        limit: {
            type: Number,
            default: 0
        },
        accept: {
            type: String,
            default: ""
        },
        fileSizeLimit: {
            type: Number,
            default: 5
        },
        action: {
            type: Function,
            required: true
        },
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            previewIndex: 0,
            showViewer: false,
            isRequestIng: false
        }
    },
    computed: {
        previewList() {
            return this.modelValue.map(el => {
                return {
                    url: this.appFileDomain + el.url,
                    name: el.name
                }
            })
        },
        appFileDomain() {
            return this.configProvider?.fileDomain || ""
        },
        localAccept() {
            let type = this.accept
            type = type.replaceAll(",", "|")
            return new RegExp(`.${type}$`)
        }
    },
    methods: {
        handlePreview(file) {
            window.open(file.url)
        },
        handleRemove(index) {
            const value = cloneDeep(this.modelValue)
            value.splice(index, 1)
            this.$emit("update:modelValue", value)
            this.formItem?.validate?.("change")
        },
        async beforeUpload(file) {
            if (!this.handleCheckSizeAndAccept(file)) {
                this.handleRemoveErrorFile(file)
                return false
            }
            return true
        },
        async handleUpload({ file }) {
            const valid = await this.beforeUpload(file)
            if (valid) {
                const formData = new FormData()
                formData.append("file", file)
                this.isRequestIng = true
                this.action(formData)
                    .then(({ data }) => {
                        this.isRequestIng = false
                        const value = cloneDeep(this.modelValue)
                        value.push(data)
                        this.$emit("update:modelValue", value)
                        this.formItem?.validate?.("change")
                    })
                    .catch(() => {
                        this.isRequestIng = false
                        this.$refs.upload.handleRemove(file)
                        console.error("文件上传失败")
                    })
            }
        },
        handleCheckSizeAndAccept(file) {
            let ext = ""
            try {
                ext = `.${file.name.split(".").pop()}`.toLocaleLowerCase()
            } catch (error) {
                console.warn(error)
            }
            const maxSize = file.size / 1024 / 1024 < this.fileSizeLimit
            if (this.accept && !this.localAccept.test(ext)) {
                this.$message.error(`上传文件格式错误，请重新上传！`)
                return false
            }

            if (!maxSize) {
                this.$message.error(`上传文件大小不能超过 ${this.fileSizeLimit}M!`)
                return false
            }

            return true
        },
        handleRemoveErrorFile(file) {
            this.$refs.upload.handleRemove(file)
        },
        handleExceed() {
            this.$message.error(`上传文件数量不能超过 ${this.limit}个!`)
            return false
        }
    }
}
</script>
