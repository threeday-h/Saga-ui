# File Upload 文件资源上传

适用于各种类型的文件上传

## 上传文件

适用于非媒体类型的文件上传，使用文件名列表的形式进行展示
:::demo

```vue
<template>
  <saga-file-upload :action="uploadAction" upload-btn-text="开始上传" />
</template>

<script setup>
import Mock from "mockjs"

async function uploadAction() {
  const data = Mock.mock({
    url: "@image('300x300', '#50B347', '#FFF', 'Mock.js')",
    cover: "@image('300x300', '#50B347', '#FFF', 'Mock.js')",
    name: "test.jpg",
  })
  return Promise.resolve(data)
}
</script>
```

:::

### Attributes

| 参数          |              说明               |   类型   | 可选值 |                       默认值                        |
| ------------- | :-----------------------------: | :------: | :----: | :-------------------------------------------------: |
| uploadBtnText |          上传按钮文本           |  string  |        |                                                     |
| tips          |             提示语              |  string  |        |                                                     |
| limit         |          文件数量限制           |  number  |        |                   image:9,video:1                   |
| fileSizeLimit |        单个文件大小限制         |  number  |        |             image:10,video:500(单位：m)             |
| action        |          文件上传方法           | function |        |                                                     |
| accept        |        接收文件格式类型         |  string  |        | image:jpg,jpeg,png,svg <br />video:wmv,mp4,avi,rmvb |
| modelValue    | 组件数据，通常使用 v-model 绑定 |  array   |        |                                                     |

### Events

| 事件名            |              说明              |   回调参数    |
| ----------------- | :----------------------------: | :-----------: |
| update:modelValue | 文件列表改变事件（上传、删除） | list:文件列表 |
