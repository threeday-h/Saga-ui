# Search 列表搜索

用于列表筛选查找的场景，一般与数据列表组件进行联动,`saga-search` 本质上是 `el-form` 组件的包装，支持 form 组件的 v-model、rules 等配置。

:::demo

```vue
<template>
  <saga-search v-model="form">
    <el-form-item label="产品名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="原产地" :xl="12" prop="area">
      <el-input v-model="form.area"></el-input>
    </el-form-item>
    <el-form-item label="产品ID" prop="productId">
      <el-input v-model="form.productId"></el-input>
    </el-form-item>
    <el-form-item label="所属类别" prop="type">
      <el-input v-model="form.type"></el-input>
    </el-form-item>
  </saga-search>
</template>

<script setup>
import { ref, reactive } from "vue"

const form = reactive({
  name: "",
  area: "",
  productId: "",
  type: "",
})
</script>
```

:::

## Attributes

| 参数       |            说明            |  类型  | 可选值 | 默认值 |
| ---------- | :------------------------: | :----: | :----: | :----: |
| modelValue |          表单数据          | Object |   --   |   {}   |
| rules      | 校验规则 ，同 el-form 配置 | Object |   --   |   {}   |
| listRef      | 查询列表组件的引用，若配置该项，本组件的查询、重置按钮将接管组件的查询操作| Object |   --   |   --   |

## FormItem Attributes

el-form-item 扩展属性

| 参数 |                说明                |  类型  | 可选值 | 默认值 |
| ---- | :--------------------------------: | :----: | :----: | :----: |
| xl   | `≥1920px` 响应式栅格数或者栅格属性 | Number |   --   |   6    |
| lg   | `≥1200px` 响应式栅格数或者栅格属性 | Number |   --   |   8    |
| md   | `≥992px` 响应式栅格数或者栅格属性  | Number |   --   |   12   |

### Events

| 事件名            |       说明       | 回调参数 |
| ----------------- | :--------------: | :------: |
| update:modelValue |   更新表单数据   | 表单数据 |
| reset             | 查询条件重置事件 |    --    |
| submit            |   发起查询事件   |    --    |
