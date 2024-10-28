<template>
    <div class="saga-media-upload">
        <div class="media-preview">
            <template v-if="uploadType === 'image'">
                <div v-for="(item, index) in modelValue" :key="index" class="media-preview__item">
                    <div class="upload-status">
                        <el-icon class="success-icon">
                            <Check />
                        </el-icon>
                    </div>
                    <div class="media-preview__handle">
                        <el-icon class="preview-icon" @click="handlePicturePreview(index)">
                            <ZoomIn />
                        </el-icon>
                        <el-icon class="delete-icon" @click="handleRemove(index)">
                            <Delete />
                        </el-icon>
                    </div>
                    <el-image class="preview-image" :src="appFileDomain + item.url" />
                </div>
            </template>

            <template v-if="uploadType === 'video'">
                <el-popover
                    v-for="(item, index) in modelValue"
                    :key="index"
                    placement="right"
                    trigger="click"
                    class="popover"
                    width="300"
                >
                    <video
                        style="width: 100%; height: 100%"
                        controls="controls"
                        preload="auto"
                        :poster="appFileDomain + item.cover"
                        class="video-js vjs-default-skin vjs-big-play-centered"
                    >
                        <source :src="appFileDomain + item.url" type="video/mp4" />
                    </video>
                    <template v-slot:reference>
                        <div class="media-preview__item">
                            <div class="upload-status">
                                <el-icon class="success-icon">
                                    <Check />
                                </el-icon>
                            </div>
                            <div class="media-preview__handle">
                                <el-icon class="play-icon">
                                    <VideoPlay />
                                </el-icon>
                                <el-icon class="delete-icon" @click="handleRemove(index)">
                                    <Delete />
                                </el-icon>
                            </div>
                            <!-- <el-image class="preview-image" :src="appFileDomain + item.cover"> -->
                            <img slot-name="error" src="./cover_default.png" style="width: 100%; height: 100%" />
                            <!-- </el-image> -->
                        </div>
                    </template>
                </el-popover>
            </template>
        </div>

        <el-upload
            ref="upload"
            v-loading="isRequestIng"
            class="upload-trigger"
            :class="{ 'upload-limit': !(localLimit > modelValue.length) }"
            list-type="picture-card"
            :file-list="modelValue"
            :limit="localLimit"
            :http-request="handleUpload"
            action="!#"
            :on-exceed="handleExceed"
            multiple
        >
            <el-icon>
                <Plus />
            </el-icon>
        </el-upload>
        <div v-if="showTips" class="upload-tips">{{ localTips }}</div>

        <ElImageViewer v-if="showViewer" @close="closeViewer" :initial-index="previewIndex" :url-list="previewList" />
    </div>
</template>

<script>
import { cloneDeep } from "lodash-es"
import { formItemContextKey } from "element-plus"
import { Check, ZoomIn, Delete, Plus, VideoPlay } from "@element-plus/icons-vue"

export default {
    name: "SagaMediaUpload",
    components: {
        VideoPlay,
        Check,
        ZoomIn,
        Delete,
        Plus
    },
    props: {
        uploadType: {
            type: String,
            default: "image"
        },
        showTips: {
            type: Boolean,
            default: true
        },
        tips: {
            type: String,
            default: ""
        },
        limit: {
            type: Number,
            default: 0
        },
        timeLimit: {
            type: Number,
            default: 15
        },
        fileSizeLimit: {
            type: Number,
            default: 0
        },
        action: {
            type: Function,
            required: true
        },
        accept: {
            type: String,
            default: ""
        },
        modelValue: {
            type: Array,
            default: () => []
        }
    },
    emits: ["update:modelValue"],
    inject: {
        formItem: formItemContextKey,
        configProvider: "configProvider"
    },
    data() {
        return {
            previewIndex: 0,
            showViewer: false,
            isRequestIng: false
        }
    },
    watch: {
        modelValue: val => {
            console.log(val)
        }
    },
    computed: {
        localTips() {
            if (this.tips) {
                return this.tips
            }
            return this.uploadType === "image"
                ? `jpg/png/svg格式，且不超过${this.localLimit}${this.localFileUnit}`
                : `wmv/mp4/avi/rmvb格式，时长${this.timeLimit}s内`
        },
        localLimit() {
            if (this.limit) {
                return this.limit
            }
            return this.uploadType === "image" ? 9 : 1
        },
        localAccept() {
            let type = ""
            if (this.accept) {
                type = this.accept
            } else {
                type = this.uploadType === "image" ? "jpg,jpeg,png,svg,ico" : "wmv,mp4,avi,rmvb"
            }
            type = type.replaceAll(",", "|")
            return new RegExp(`.${type}$`)
        },
        localFileSizeLimit() {
            if (this.fileSizeLimit) {
                return this.fileSizeLimit
            }
            return this.uploadType === "image" ? 10 : 500
        },
        localFileName() {
            return this.uploadType === "image" ? "图片" : "视频"
        },
        localFileUnit() {
            return this.uploadType === "image" ? "张" : "个"
        },
        previewList() {
            return this.modelValue.map(el => {
                return this.appFileDomain + el.url
            })
        },
        appFileDomain() {
            return this.configProvider?.fileDomain || ""
        }
    },
    methods: {
        handleRemove(index) {
            const value = cloneDeep(this.modelValue)
            value.splice(index, 1)
            this.$emit("update:modelValue", value)
            this.formItem?.validate?.("change")
        },
        handlePicturePreview(index) {
            document.body.style.overflow = "hidden"
            this.previewIndex = index
            this.$nextTick(() => {
                this.showViewer = true
            })
        },
        closeViewer() {
            document.body.style.overflow = ""
            this.showViewer = false
        },
        getFileDuration(file) {
            return new Promise(resolve => {
                let video = document.createElement("video")
                video.preload = "metadata"
                video.onloadedmetadata = function () {
                    window.URL.revokeObjectURL(video.src)
                    resolve(video.duration)
                }
                video.src = URL.createObjectURL(file)
            })
        },
        async beforeUpload(file) {
            if (!this.handleCheckSizeAndAccept(file)) {
                this.handleRemoveErrorFile(file)
                return false
            }

            if (this.uploadType === "video") {
                const duration = await this.getFileDuration(file)
                if (duration > this.timeLimit) {
                    this.$message.error(`请上传${this.timeLimit}s以内视频`)
                    this.handleRemoveErrorFile(file)
                    return false
                }
            }
            return true
        },
        async handleUpload({ file }) {
            const valid = await this.beforeUpload(file)
            if (valid) {
                const formData = new FormData()
                formData.append("file", file)
                formData.append("cover", 1)
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
            const maxSize = file.size / 1024 / 1024 < this.localFileSizeLimit
            if (!this.localAccept.test(ext)) {
                this.$message.error(`上传${this.localFileName}格式错误，请重新上传！`)
                return false
            }

            if (!maxSize) {
                this.$message.error(`上传${this.localFileName}大小不能超过 ${this.localFileSizeLimit}M!`)
                return false
            }

            return true
        },
        handleRemoveErrorFile(file) {
            this.$refs.upload.handleRemove(file)
        },
        handleExceed() {
            this.$message.error(`上传文件数量不能超过 ${this.localLimit}${this.localFileUnit}!`)
            return false
        }
    }
}
</script>

<style lang="scss">
.saga-media-upload {
    display: flex;
    flex-wrap: wrap;

    .el-upload-list__item {
        display: none;
    }

    .upload-limit {
        display: none;
    }

    .upload-trigger .el-upload {
        width: 68px;
        height: 68px;
        border-radius: 2px;
        margin-bottom: 10px;
    }

    .upload-tips {
        display: flex;
        align-items: flex-end;
        margin-left: 10px;
        margin-bottom: 10px;
        color: #bbb;
    }

    .media-preview {
        display: flex;
        flex-wrap: wrap;
    }

    .media-preview__item {
        position: relative;
        width: 68px;
        height: 68px;
        border-radius: 2px;
        overflow: hidden;
        margin: 0 10px 10px 0;

        .preview-image {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }

        .preview-icon,
        .delete-icon,
        .play-icon {
            position: relative;
            color: #fff;
            z-index: 1;
            font-size: 20px;

            &:hover {
                cursor: pointer;
            }
        }

        .delete-icon {
            margin-left: 5px;
        }

        .media-preview__handle {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            z-index: 1;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: default;
            text-align: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            transition: opacity 0.3s;
        }

        .media-preview__handle:hover {
            opacity: 1;
        }

        .upload-status {
            position: absolute;
            right: -15px;
            top: -6px;
            width: 40px;
            height: 24px;
            z-index: 1;
            background: #13ce66;
            text-align: center;
            transform: rotate(45deg);
            box-shadow: 0 0 1pc 1px rgba(0, 0, 0, 0.2);

            .success-icon {
                font-size: 12px;
                margin-top: 11px;
                color: #fff;
                transform: rotate(-45deg);
            }
        }
    }

    .upload-limit .el-upload--picture-card {
        display: none;
    }

    .preview-dialog .el-icon-circle-close {
        color: #fff !important;
    }
}
</style>
