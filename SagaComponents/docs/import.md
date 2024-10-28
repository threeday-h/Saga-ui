# Import 数据导入

适用于通过上传文件导入数据的场景

## 基本使用

::: demo

```vue
<!-- 导入 -->
<template>
  <saga-import :action="impportAction" temp-url="temp/员工导入模板.xlsx" @refresh="handleRefresh" />
</template>

<script setup>
function impportAction(formdata) {
  // 文件上传操作...
}

function handleRefresh() {
  // 刷新数据列表...
}
</script>
```

:::

### Attributes

| 参数        |                     说明                      |   类型   | 默认值 |
| ----------- | :-------------------------------------------: | :------: | :----: |
| title       |                   弹框标题                    |  string  |  导入  |
| btnText     |                   按钮文本                    |  string  |  导入  |
| uploadLimit |           导入文件大小限制,单位 KB            |  number  | 10240  |
| action      |                   文件导入                    | Function |   -    |
| queryAction |           离线文件导入任务状态查询            | Function |   --   |
| tempUrl     |               导入模板下载地址                |  string  |   -    |
| data        |              文件上传时附属数据               |  object  |   {}   |
| prefixValid | 开始导入前置校验函数，接受一个 promise 返回值 | function |  null  |
| fileKey     |          上传时文件对象使用的 key 名          |  string  |  file  |

### Events

| 事件名  |                说明                | 回调参数 |
| ------- | :--------------------------------: | :------: |
| refresh | 导入成功之后触发，请求更新数据列表 |    -     |

### Slot

| name    |         说明         |
| ------- | :------------------: |
| default |   导入事件触发按钮   |
| form    | 可以插入一个表单节点 |
