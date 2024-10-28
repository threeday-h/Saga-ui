# QueryList 数据查询列表

数据查询组件，涵盖了数据列表的自动查询、跨页多选、翻页等功能

## 基本使用

:::demo

```vue
<template>
  <saga-query-list :server="httpServer" v-model:selectRows="selectRows">
    <el-table-column label="姓名" prop="nickname"></el-table-column>
    <el-table-column label="分数" prop="score"></el-table-column>
    <el-table-column label="排名" prop="rank"></el-table-column>
    <el-table-column label="星级" prop="stars"></el-table-column>
  </saga-query-list>
</template>

<script setup>
import { ref } from "vue"
import Mock from "mockjs"

const selectRows = ref([])

const httpServer = async function ({ pageSize }) {
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

| 参数       |                     说明                      |   类型   |   可选值   |      默认值      |
| ---------- | :-------------------------------------------: | :------: | :--------: | :--------------: |
| useElTable |          列表是否使用 el-table 包裹           | Boolean  | true/false |       true       |
| lazy       |       是否在组件挂载时立刻进行数据查询        | Boolean  | true/false |      false       |
| server     |       数据查询方法,返回值要求是 Promise       | Function |     --     |        --        |
| paramClear |                   Function                    | Boolean  | true/false |      false       |
| dataFilter |                   数据过滤                    | Boolean  |     --     |        --        |
| selection  |                是否开启行选择                 | Boolean  | true/false |       true       |
| selectable |                判断行是否可选                 | Function |     --     |        --        |
| selectRows |            勾选的行，支持 v-model             |  Array   |     --     |        []        |
| rowKey     |             行数据的唯一标识字段              |  String  |     --     |        id        |
| data       |                 查询附带参数                  |  Object  |     --     |        {}        |
| pageSizes  | 分页大小可选项 ，数组第一项将作为默认分页大小 |  Array   |     --     | [10, 20, 30, 50] |

### Events

| 事件名            |    说明    |            回调参数            |
| ----------------- | :--------: | :----------------------------: |
| update:selectRows | 更新选中行 | rows:Array ,当前被选中的行数据 |

### Methods

| 方法名  |                   说明                   | 参数 |
| ------- | :--------------------------------------: | :--: |
| query   | 发起数据查询，默认会前置调用 reset 方法  |  --  |
| reset   | 重置分页、数据选择，清空已经查询到的数据 |  --  |
| getList |    维持当前分页数据不变，发起数据查询    |  --  |
