# Dialog Form 弹窗表单

适用于 CURD 场景中的弹窗嵌套表单场景，组件默认封装了表单填写场景下，弹出框的一些常规配置、交互。以及弹窗关闭时表单数据初始化、状态还原等操作。

## 使用示例

> 组件`v-model`指令接受的数据需要为经过 `ref` 处理的 `Object` 类型对象。

:::demo

```vue
<template>
  <el-button @click="create">新增</el-button>
  <saga-dialog-form v-model:visible="visible" v-model="formData" :submit="handleSubmit" :rules="rules">
    <el-form-item label="姓名" prop="name">
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="年龄" prop="age">
      <el-input v-model="formData.age" />
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="formData.address" />
    </el-form-item>
  </saga-dialog-form>
</template>

<script setup>
import { ref } from "vue"

const visible = ref(false)

const formData = ref({
  name: "",
  age: "",
  address: "",
})

const rules = {
  name: {
    required: true,
    message: "请输入",
  },
}

function create() {
  visible.value = true
}

function handleSubmit(formData) {
  return new Promise(resolve => {
    //模拟异步提交操作
    setTimeout(() => {
      resolve({
        msg: "新增成功",
      })
    }, 2000)
  })
}
</script>
```

:::

## Attributes

| 参数        |                                                                 说明                                                                  |   类型   | 可选值 | 默认值 |
| ----------- | :-----------------------------------------------------------------------------------------------------------------------------------: | :------: | :----: | :----: |
| modelValue  |                         表单数据,当弹窗关闭时，modelValue 将被还原成 sagaDialogForm 挂载时所接收到的数据状态                          |  Object  |   --   |   {}   |
| rules       |                                                      校验规则 ，同 el-form 配置                                                       |  Object  |   --   |   {}   |
| visible     |                                                            是否显示 Dialog                                                            | Boolean  |   --   | false  |
| title       |                                                         Dialog 对话框 的标题                                                          |  String  |   --   |   --   |
| width       |                                                             Dialog 的宽度                                                             |  String  |   --   | 800px  |
| top         |                                                     Dialog CSS 中的 margin-top 值                                                     |  String  |   --   |  15vh  |
| labelWidth  |                        标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto。                        |  String  |   --   | 120px  |
| submit      | 默认参数为经过深拷贝的 modelValue 的值，表单的`提交`函数 ,返回值要求为 Promise,resolve 默认参数中返回的`msg`字段，将用作 message 展示 | Function |   --   |   --   |
| safety      |                                                   是否需要在关闭弹框前进行一次确认                                                    | Boolean  |   --   | false  |
| submitClose |                                                      提交成功后是否立即关闭弹框                                                       | Boolean  |   --   |  true  |

### Events

| 事件名            |          说明          | 回调参数 |
| ----------------- | :--------------------: | :------: |
| update:modelValue |      更新表单数据      | 表单数据 |
| update:visible    | 更新 Dialog 隐藏、显示 |    --    |
| validateFail      |    表单校验失败事件    |    --    |
