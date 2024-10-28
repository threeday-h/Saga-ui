# Fold Buttons 折叠按钮组

自动折叠过多的按钮，适用于列表中操作按钮过多的情况下，可以自动折叠按钮。

## 示例

:::demo
```vue
<template>
  <saga-fold-buttons>
    <el-link @click="handleClick('view')" type="primary">查看</el-link>
    <el-link @click="handleClick('edit')" type="primary">编辑</el-link>
    <el-link @click="handleClick('del')" type="primary">删除</el-link>
    <el-link @click="handleClick('export')" type="primary">导出</el-link>
  </saga-fold-buttons>
</template>

<script setup>
function handleClick(code){
  alert(`你点击了${code}`)
}
</script>
```
:::


### Attributes

| 参数        |                     说明                      |   类型   | 默认值 |
| ----------- | :-------------------------------------------: | :------: | :----: |
| items       |                   设置直接显示的按钮数量，超限的按钮将被自动折叠                  |  number  |  2  |
| btnText     |                   折叠按钮文本                    |  string  |  '更多'  |
