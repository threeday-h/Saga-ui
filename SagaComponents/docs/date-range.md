# DateRange 日期区间

适用于日期范围筛选，支持数据双向绑定
返回的是日期时间戳，精确到毫秒。开始时间是从选择的日期的 0 点 00 分 00 秒开始，结束时间是从选择的日期的 23 点 59 分 59 秒结束

## 日范围

:::demo

```vue
<template>
  <saga-date-range v-model:startTime="startTime" v-model:endTime="endTime" type="date" />
  <div style="margin-top: 10px">开始时间：{{ format(startTime) }}</div>
  <div style="margin-top: 10px">结束时间：{{ format(endTime) }}</div>
</template>

<script setup>
import { ref } from "vue"
import dayjs from "dayjs"

const startTime = ref("")
const endTime = ref("")

function format(date) {
  return date ? dayjs(date).format("YYYY/MM/DD HH:mm:ss") : ""
}
</script>
```

:::

## 不允许跨月

:::demo

```vue
<template>
  <saga-date-range v-model:startTime="startTime" v-model:endTime="endTime" type="date" disable-cross="month" />
  <div style="margin-top: 10px">开始时间：{{ format(startTime) }}</div>
  <div style="margin-top: 10px">结束时间：{{ format(endTime) }}</div>
</template>

<script setup>
import { ref } from "vue"
import dayjs from "dayjs"

const startTime = ref("")
const endTime = ref("")

function format(date) {
  return date ? dayjs(date).format("YYYY/MM/DD HH:mm:ss") : ""
}
</script>
```

:::

## 月范围

:::demo

```vue
<template>
  <saga-date-range v-model:startTime="startTime" v-model:endTime="endTime" type="month" />
  <div style="margin-top: 10px">开始时间：{{ format(startTime) }}</div>
  <div style="margin-top: 10px">结束时间：{{ format(endTime) }}</div>
</template>

<script setup>
import { ref } from "vue"
import dayjs from "dayjs"

const startTime = ref("")
const endTime = ref("")

function format(date) {
  return date ? dayjs(date).format("YYYY/MM/DD HH:mm:ss") : ""
}
</script>
```

:::

## 年范围

:::demo

```vue
<template>
  <saga-date-range v-model:startTime="startTime" v-model:endTime="endTime" type="year" />
  <div style="margin-top: 10px">开始时间：{{ format(startTime) }}</div>
  <div style="margin-top: 10px">结束时间：{{ format(endTime) }}</div>
</template>

<script setup>
import { ref } from "vue"
import dayjs from "dayjs"

const startTime = ref("")
const endTime = ref("")

function format(date) {
  return date ? dayjs(date).format("YYYY/MM/DD HH:mm:ss") : ""
}
</script>
```

:::

### Attributes

| 参数                        |               说明               |      类型      |               可选值                |       默认值        |
| --------------------------- | :------------------------------: | :------------: | :---------------------------------: | :-----------------: |
| startPlaceholder            |      开始时间的 placeholder      |     string     |                  -                  |      开始时间       |
| endPlaceholder              |      结束时间的 placeholder      |     string     |                  -                  |      结束时间       |
| startTime/v-model:startTime |           绑定开始时间           |     string     |                  -                  |          -          |
| endTime /v-model:endTime    |           绑定结束时间           |     string     |                  -                  |          -          |
| type                        |             时期类型             |     string     | "datetime", "date", "month", "year" |       "date"        |
| disableCross                | 是否禁止跨越范围(跨天/跨月/跨年) | string/boolean |       "day", "month", "year"        |        false        |
| startAttr                   | 传递给开始时间的 ElFormItem 属性 |    obeject     |                 --                  | {prop: 'startTime'} |
| endAttr                     | 传递给开始时间的 ElFormItem 属性 |    obeject     |                 --                  |  {prop: 'endTime'}  |

### Events

| 事件名           |     说明     | 回调参数 |
| ---------------- | :----------: | :------: |
| update:startTime | 更新开始时间 |  时间戳  |
| update:endTime   | 更新结束时间 |  时间戳  |
