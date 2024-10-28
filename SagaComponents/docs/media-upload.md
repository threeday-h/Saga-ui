# Media Upload 媒体资源上传

适用于各种场景下的图片、视频文件上传

## 上传图片

上传图片组件，默认允许 jpg/svg/png 格式上传

:::demo

```vue
<template>
  <saga-media-upload v-model="value" :action="uploadAction" />
</template>
<script setup>
import { ref } from "vue"
import Mock from "mockjs"

const value = ref([])

async function uploadAction() {
  const data = Mock.mock({
    url: "@image('300x300', '#50B347', '#FFF', 'Saga')",
    cover: "@image('300x300', '#50B347', '#FFF', 'Saga')",
    name: "test.jpg",
  })
  return Promise.resolve({
    data,
  })
}
</script>
```

:::

## 上传视频

上传视频组件，默认限制 15s 以内
:::demo

```vue
<template>
  <saga-media-upload v-model="value" upload-type="video" :action="uploadAction" />
</template>
<script setup>
import { ref } from "vue"
import Mock from "mockjs"

const value = ref([])

async function uploadAction() {
  const data = Mock.mock({
    url: "https://media.w3.org/2010/05/sintel/trailer.mp4",
    cover: "@image('300x300', '#50B347', '#FFF', 'Saga')",
    name: "trailer.mp4",
  })
  return Promise.resolve({
    data,
  })
}
</script>
```

:::

### Attributes

| 参数          |              说明               |   类型   |   可选值    |                       默认值                        |
| ------------- | :-----------------------------: | :------: | :---------: | :-------------------------------------------------: |
| uploadType    |            上传类型             |  string  | image/video |                        image                        |
| showTips      |         是否设置提示语          | boolean  |             |                        true                         |
| tips          |             提示语              |  string  |             |                                                     |
| limit         |          文件数量限制           |  number  |             |                   image:9,video:1                   |
| timeLimit     |          视频长度显示           |  number  |             |                    15 (单位：s)                     |
| fileSizeLimit |        单个文件大小限制         |  number  |             |             image:10,video:500(单位：m)             |
| action        |          文件上传方法           | function |             |                                                     |
| accept        |        接收文件格式类型         |  string  |             | image:jpg,jpeg,png,svg <br />video:wmv,mp4,avi,rmvb |
| modelValue    | 组件数据，通常使用 v-model 绑定 |  array   |             |                                                     |

### Events

| 事件名            |              说明              |   回调参数    |
| ----------------- | :----------------------------: | :-----------: |
| update:modelValue | 文件列表改变事件（上传、删除） | list:文件列表 |
