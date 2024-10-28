<template>
    <div class="saga-photo-wall">
        <template v-if="images.length">
            <el-image
                v-for="(img, index) in images"
                :key="img.url"
                :style="`width: ${realSize[0]}px; height: ${realSize[1]}px`"
                :src="`${appFileDomain}${img.url}`"
                :preview-src-list="photoList"
                :initial-index="index"
                fit="cover"
            />
        </template>
        <template v-else>
            <div class="image-placehold" :style="`width: ${realSize[0]}px; height: ${realSize[1]}px`">
                <el-icon>
                    <PictureFilled />
                </el-icon>
                <div class="empty-text">
                    {{ emptyTips }}
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { defineComponent, inject, ref, computed } from "vue"
import { PictureFilled } from "@element-plus/icons-vue"

export default defineComponent({
    name: "SagaPhotoWall",

    components: {
        PictureFilled
    },
    props: {
        images: {
            type: Array,
            default: () => []
        },
        size: {
            type: String,
            default: "60"
        },
        emptyTips: {
            type: String,
            default: "暂无图片"
        }
    },
    setup(props) {
        const configProvider = inject("configProvider")

        const realSize = computed(() => {
            const sizes = props.size.split(" ")
            if (sizes.length === 1) {
                sizes[1] = sizes[0]
            }
            return sizes
        })

        const appFileDomain = computed(() => {
            return configProvider?.fileDomain || ""
        })

        const photoList = computed(() => {
            return props.images.map(el => {
                return appFileDomain.value + el.url
            })
        })

        return {
            realSize,
            appFileDomain,
            photoList
        }
    }
})
</script>
