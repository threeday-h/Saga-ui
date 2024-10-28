<template>
    <div class="saga-date-range">
        <el-form-item v-bind="startAttr">
            <el-date-picker
                @update:modelValue="handleSyncStartTime"
                :modelValue="props.startTime"
                value-format="x"
                :type="props.type"
                :default-value="startTimeDefault"
                :disabled-date="getStartTimeDisabled"
                :placeholder="props.startPlaceholder"
                :shortcuts="props.startShortcuts"
                @change="handleStartTimeChange"
            />
        </el-form-item>
        <span class="separator">~</span>
        <el-form-item v-bind="endAttr">
            <el-date-picker
                @update:modelValue="handleSyncEndTime"
                :modelValue="props.endTime"
                :default-value="endTimeDefault"
                :disabled-date="getEndTimeDisabled"
                value-format="x"
                :type="props.type"
                :placeholder="props.endPlaceholder"
                :shortcuts="props.endShortcuts"
                @change="handleEndTimeChange"
            />
        </el-form-item>
    </div>
</template>

<script>
export default {
    name: "SagaDateRange"
}
</script>

<script setup>
import dayjs from "dayjs"
import { ref } from "vue"

const startTimeDefault = ref(new Date())
const endTimeDefault = ref(new Date())

const props = defineProps({
    startPlaceholder: {
        type: String,
        default: "开始时间"
    },
    endPlaceholder: {
        type: String,
        default: "结束时间"
    },
    startTime: {
        type: [String, Number],
        default: ""
    },
    endTime: {
        type: [String, Number],
        default: ""
    },
    startAttr: {
        type: Object,
        default: () => ({
            prop: "startTime"
        })
    },
    endAttr: {
        type: Object,
        default: () => ({
            prop: "endTime"
        })
    },
    type: {
        type: String,
        default: "date",
        validator: value => {
            return ["datetime", "date", "month", "year"].includes(value)
        }
    },
    disableCross: {
        type: [Boolean, String],
        default: false,
        validator: value => {
            return [false, "day", "month", "year"].includes(value)
        }
    },
    startShortcuts: {
        type: Array,
        default: []
    },
    endShortcuts: {
        type: Array,
        default: []
    }
})

const emits = defineEmits(["update:startTime", "update:endTime", "startTimeChange", "endTimeChange"])

function getStartTimeDisabled(date) {
    if (props.endTime === "") {
        return false
    } else if (dayjs(date).isAfter(dayjs(props.endTime))) {
        return true
    } else if (props.disableCross && !dayjs(props.endTime).isSame(dayjs(date), props.disableCross)) {
        return true
    }
    return false
}

function getEndTimeDisabled(date) {
    if (props.startTime === "") {
        return false
    } else if (dayjs(date).isBefore(dayjs(props.startTime))) {
        return true
    } else if (props.disableCross && !dayjs(props.startTime).isSame(dayjs(date), props.disableCross)) {
        return true
    }
    return false
}

function handleSyncStartTime(val) {
    if (val && props.endTime === "") {
        endTimeDefault.value = dayjs(val).endOf("day").toDate()
    }

    emits("update:startTime", val)
}

function handleSyncEndTime(val) {
    if (val && props.startTime === "") {
        startTimeDefault.value = dayjs(val).startOf("day").toDate()
    }

    let value = val
    // 补上末尾时间 23:59:59
    if (val && props.type !== "datetimerange" && props.endShortcuts.length === 0) {
        if (props.type === "datetime") {
            value = dayjs(value).endOf(props.type).valueOf()
        } else {
            value = dayjs(value).set("hour", 23).set("minute", 59).set("second", 59).valueOf()
        }
    }
    emits("update:endTime", value)
}

function handleStartTimeChange(value) {
    emits("startTimeChange", value)
}

function handleEndTimeChange(value) {
    emits("endTimeChange", value)
}
</script>

<style lang="scss">
.saga-date-range {
    display: flex;
    width: 100%;
    align-items: center;

    > .el-form-item {
        flex: 1;
        margin-right: 0;

        .el-input {
            width: 100%;
        }
    }

    .separator {
        padding: 0 5px;
        flex-shrink: 0;
    }
}
</style>
