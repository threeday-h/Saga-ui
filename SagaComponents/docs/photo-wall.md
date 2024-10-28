# PhotoWall 照片墙

用于展示一组图片，集成了图片预览功能。

## 示例

:::demo

```vue
<template>
  <SagaConfigProvider file-domain="http://192.168.6.49:8099">
    <SagaPhotoWall :images="imgs" />
  </SagaConfigProvider>
</template>

<script setup>
import { ref } from "vue"

const imgs = ref([])
imgs.value = [
  {
    name: "v2-078ab813328714c3e00f4137c78f956a_1440w.jpeg",
    path: "/upload/file/20220615/",
    size: 366557,
    thumbnail: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
    type: "jpeg",
    url: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
    watermark: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
  },
  {
    name: "v2-078ab813328714c3e00f4137c78f956a_1440w.jpeg",
    path: "/upload/file/20220615/",
    size: 366557,
    thumbnail: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
    type: "jpeg",
    url: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
    watermark: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
  },
]
</script>
```

:::

### 自定义尺寸

:::demo

```vue
<template>
  <SagaConfigProvider file-domain="http://192.168.6.49:8099">
    <SagaPhotoWall size="80" :images="imgs" />
    <SagaPhotoWall size="80 100" :images="imgs" />
    <SagaPhotoWall size="100 80" :images="imgs" />
  </SagaConfigProvider>
</template>

<script setup>
import { ref } from "vue"

const imgs = ref([])
imgs.value = [
  {
    name: "v2-078ab813328714c3e00f4137c78f956a_1440w.jpeg",
    path: "/upload/file/20220615/",
    size: 366557,
    thumbnail: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
    type: "jpeg",
    url: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
    watermark: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
  },
  {
    name: "v2-078ab813328714c3e00f4137c78f956a_1440w.jpeg",
    path: "/upload/file/20220615/",
    size: 366557,
    thumbnail: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
    type: "jpeg",
    url: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
    watermark: "/upload/file/20220615/6mliecjr70jvko48aok56tuth6.jpeg",
  },
]
</script>
```

:::

### 没有图片时的表现

:::demo

```vue
<template>
  <SagaConfigProvider file-domain="http://192.168.6.49:8099">
    <SagaPhotoWall size="80" :images="imgs" />
  </SagaConfigProvider>
</template>

<script setup>
import { ref } from "vue"

const imgs = ref([])
</script>
```

:::

### Attributes

| 参数      |                   说明                    |  类型  |  默认值  |
| --------- | :---------------------------------------: | :----: | :------: |
| images    |     图片列表，格式为框架标准文件格式      | Array  |    []    |
| size      | 单个图片的尺寸，支持'60','60 80' 类似配置 | String |   '60'   |
| emptyTips |            没有图片时的提示语             | String | 暂无图片 |
