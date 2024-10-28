# Config Provider 全局配置

Config Provider 被用来提供全局的配置选项，让你的配置能够在全局都能够被访问到。

## 配置

:::demo

```vue
<template>
  <SagaConfigProvider file-domain="http://">
    <el-form ref="form" :model="formModel" :rules="rules">
      <el-form-item label="头像" prop="file">
        <saga-file-upload :action="uploadMock" v-model="formModel.file" />
      </el-form-item>
      <el-button @click="handleSubmit">Submit</el-button>
    </el-form>
  </SagaConfigProvider>
</template>

<script setup>
import { reactive, ref } from "vue"

const form = ref(null)

const rules = {
  file: {
    required: true,
    message: "请选择文件",
  },
}

const formModel = reactive({
  file: [],
})

function uploadMock() {}

async function handleSubmit() {
  await form.value.validate()
}
</script>
```

:::

## Config Provider 属性

| 参数       | 说明                                   | 类型   | 可选值 | 默认值 |
| ---------- | -------------------------------------- | ------ | ------ | ------ |
| fileDomain | 文件预览、下载服务器地址即文件路径前缀 | string | --     | --     |
