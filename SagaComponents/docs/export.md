# Export 数据导出

发起数据列表的导出动作

## 基本使用

::: demo

```vue
<!-- 导出 -->
<template>
  <saga-export
    :check-list="multipleSelection"
    :export-action="exportAction"
    :column-action="columnAction"
    :query-action="queryAction"
  />
  <saga-query-list :server="httpServer" v-model:selectRows="multipleSelection">
    <el-table-column label="姓名" prop="nickname"></el-table-column>
    <el-table-column label="分数" prop="score"></el-table-column>
    <el-table-column label="排名" prop="rank"></el-table-column>
    <el-table-column label="星级" prop="stars"></el-table-column>
  </saga-query-list>
</template>

<script setup>
import { ref } from "vue"
import Mock from "mockjs"

const multipleSelection = ref([])

function exportAction() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: {
          offline: true,
          taskId: "test",
        },
      })
    }, 3000)
  })
}

async function columnAction() {
  return Promise.resolve({
    data: {
      name: "姓名",
      age: "年龄",
      sex: "性别",
    },
  })
}

async function queryAction() {
  return Promise.resolve({
    data: {
      status: { value: 0 },
      downloadUrl: "http://***",
    },
  })
}

async function httpServer({ pageSize }) {
  const data = Mock.mock({
    [`list|${pageSize}`]: [
      {
        id: "@datetime",
        "score|1-800": 800,
        "rank|1-100": 100,
        "stars|1-5": 5,
        nickname: "@cname",
      },
    ],
    totalCount: 20,
  })
  return Promise.resolve({
    data,
  })
}
</script>
```

:::

### Attributes

| 参数         |                         说明                         |   类型   | 默认值 |
| ------------ | :--------------------------------------------------: | :------: | :----: |
| columnAction |                 获取可供导出的列接口                 | function |   -    |
| exportAction |                       导出接口                       | function |   -    |
| queryAction  |     离线导出任务查询接口,可以在 Provider 中注入      | function |   -    |
| checkList    |          当前已选中的数据（供勾选导出使用）          |  array   |   -    |
| idKey        | 传递已选中数据 id 时，所使用的 key（供勾选导出使用） |  string  |  ids   |
| data         |                 发起导出时，附带数据                 |  object  |   -    |
| disabled     |                   是否禁用导出组件                   | boolean  | false  |

### Events

| 事件名  |                说明                | 回调参数 |
| ------- | :--------------------------------: | :------: |
| refresh | 导出成功之后触发，请求更新数据列表 |    -     |
