<script>
export default {
    name: "SagaQueryList"
}
</script>

<script setup>
import { forIn, findIndex, cloneDeep, remove, uniqBy, concat, first, xorBy, intersectionBy } from "lodash-es"
import { ref, watchEffect, reactive, onMounted, inject, nextTick } from "vue"

const SagaQueryListHeight = inject("SagaQueryListHeight", { height: null })

const emits = defineEmits(["update:selectRows", "pageChange", "selectAll"])

const props = defineProps({
    useElTable: {
        type: Boolean,
        default: true
    },
    lazy: {
        type: Boolean,
        default: false
    },
    server: Function,
    loadingTxt: {
        type: String,
        default: "数据加载中..."
    },
    paramClear: {
        type: Boolean,
        default: false
    },
    dataFilter: {
        type: Function,
        default: data => data
    },
    selectRows: {
        type: Array,
        default: () => []
    },
    selectable: {
        type: Function,
        default: () => true
    },
    rowKey: {
        type: String,
        default: "id"
    },
    selection: {
        type: Boolean,
        default: true
    },
    pageSizes: {
        type: Array,
        default: () => [10, 20, 30, 50]
    },
    data: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

// 页码变动事件
function doChangePage(val) {
    pageData.pageNum = val
    getList()
}

// 页大小变动事件
function doSizeChange(val) {
    pageData.pageSize = val
    pageData.pageNum = 1
    getList()
}

function getList() {
    return new Promise((resolve, reject) => {
        const { total, ...pager } = pageData
        const params = Object.assign({}, props.data, pager)
        if (props.paramClear) {
            forIn(params, (value, key) => {
                if (value === "") delete params[key]
            })
        }
        isRequestIng.value = true

        props
            .server(params)
            .then(data => {
                rows.value = props.dataFilter(data.rows || [])
                pageData.total = data.total
                isRequestIng.value = false
                handlePageUpdate()
                resolve()
            })
            .catch(e => {
                isRequestIng.value = false
                reject()
            })
    })
}

function handlePageUpdate() {
    const selectRows = cloneDeep(props.selectRows)

    if (selectRadio.value === "all") {
        const excludeKeys = uniqBy(selectExclude.value, el => el[props.rowKey]).map(el => el[props.rowKey])
        const dataRows = rows.value.filter(el => !excludeKeys.includes(el[props.rowKey]))

        dataRows.forEach(row => {
            toggleRowSelection(row, true)
        })

        const newSelectRows = uniqBy(concat(selectRows, cloneDeep(dataRows)), el => el[props.rowKey])

        selectRowsLength.value = pageData.total - excludeKeys.length
        emits("update:selectRows", newSelectRows)
    } else {
        rows.value.forEach(row => {
            if (
                findIndex(selectRows, el => {
                    return el[props.rowKey] === row[props.rowKey]
                }) !== -1
            ) {
                toggleRowSelection(row, true)
            }
        })
    }

    emits("pageChange")
}

function handleSelect(selectedRow) {
    selectedRow.selected = !selectedRow.selected
    toggleRowSelection(selectedRow, selectedRow.selected)
    syncRowSelection(selectedRow, selectedRow.selected)
}

function handleSelectionChange() {
    return false
}

function reset() {
    pageData.pageNum = 1
    pageData.total = 0
    pageData.pageSize = first(props.pageSizes)
    rows.value = []

    clearSelection()
}

async function clearSelection() {
    if (props.useElTable) {
        tabList.value.clearSelection()
    }
    selectRadio.value = "current"
    rows.value.forEach(el => (el.selected = false))
    selectRowsLength.value = 0
    selectExclude.value = []
    emits("update:selectRows", [])
}

async function query() {
    reset()
    await getList()
}

const pageData = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0
})
const rows = ref([])
const isRequestIng = ref(false)

const tabList = ref(null)

const allSelectOpen = ref(false)
const selectRadio = ref("current")
const selectRowsLength = ref(0)
const selectExclude = ref([])

function selectAll(selected) {
    if (props.useElTable && selected) {
        if (selected.length === 0) {
            clearSelection()
        } else {
            allSelectOpen.value = true
        }
    } else {
        allSelectOpen.value = true
    }
}

function allSelConfirm() {
    rows.value.forEach(row => {
        toggleRowSelection(row, true)
    })

    const selectData = cloneDeep(rows.value)
    emits("update:selectRows", selectData)

    selectExclude.value = []

    if (selectRadio.value === "current") {
        selectRowsLength.value = selectData.length
    } else if (selectRadio.value === "all") {
        selectRowsLength.value = pageData.total
    }
    // selectRowsLength.value = selectData.length

    allSelectOpen.value = false
}

function allSelCancel() {
    if (props.useElTable) {
        clearSelection()
    }
    allSelectOpen.value = false
}

function toggleRowSelection(row, selected) {
    if (props.useElTable) {
        nextTick(() => {
            tabList.value.toggleRowSelection(row, selected)
        })
    }
    row.selected = selected
}

function syncRowSelection(row, selected) {
    const selectData = cloneDeep(props.selectRows)

    if (selected) {
        remove(selectExclude.value, el => el[props.rowKey] === row[props.rowKey])
        selectData.push(row)
        selectRowsLength.value += 1
    } else {
        remove(selectData, el => el[props.rowKey] === row[props.rowKey])
        const excludeData = selectExclude.value.find(el => el[props.rowKey] === row[props.rowKey])
        if (!excludeData) {
            selectExclude.value.push(row)
        }
        selectRowsLength.value--
    }

    const uniqSelectData = uniqBy(selectData, el => el[props.rowKey])

    emits("update:selectRows", uniqSelectData)
}

function selectRow(row, selected) {
    toggleRowSelection(row, selected)
    syncRowSelection(row, selected)
}

function getSelection() {
    return {
        selectAll: selectRadio.value === "all",
        selectRowsLength: selectRowsLength.value,
        excludeIds: selectRadio.value === "all" ? selectExclude.value.map(el => el[props.rowKey]) : [],
        includeIds: selectRadio.value === "all" ? [] : props.selectRows.map(el => el[props.rowKey])
    }
}

function selectRowsNumber() {
    return selectRowsLength.value
}

watchEffect(() => {
    pageData.pageSize = first(props.pageSizes)
})

onMounted(() => {
    if (!props.lazy) {
        query()
    }
})

defineExpose({
    query,
    reset,
    clearSelection,
    getList,
    selectAll,
    selectRow,
    getSelection,
    selectRowsNumber,
    rows
})
</script>

<template>
    <div class="saga-query-list">
        <transition name="el-fade-in">
            <div v-show="selectRowsLength > 0" class="query-selection-bar">
                选择了<span class="query-selection-bar__text">{{ selectRowsLength }}</span
                >条数据
                <a class="query-selection-bar__clear" @click="clearSelection">清空</a>
            </div>
        </transition>
        <div v-loading="isRequestIng" class="data-list__table" :element-loading-text="props.loadingTxt">
            <el-table
                v-if="useElTable"
                ref="tabList"
                :height="SagaQueryListHeight?.height"
                :data="rows"
                @select-all="selectAll"
                @selection-change="handleSelectionChange"
                v-bind="$attrs"
            >
                <el-table-column type="selection" width="55" v-if="props.selection" :selectable="props.selectable">
                    <template v-slot="{ selection, row, rowIndex }">
                        <el-checkbox :model-value="row.selected" @change="handleSelect(row)" :key="row[props.rowKey]" />
                    </template>
                </el-table-column>
                <slot />
            </el-table>
            <div v-else>
                <slot :rows="rows" />
            </div>
        </div>
        <div class="query-list__pager">
            <el-pagination
                :current-page="pageData.pageNum"
                @update:current-page="doChangePage"
                :page-size="pageData.pageSize"
                @update:page-size="doSizeChange"
                :hide-on-single-page="true"
                :total="pageData.total"
                background
                :page-sizes="props.pageSizes"
                layout="sizes,total, ->, prev, pager, next, jumper"
            />
        </div>
        <el-dialog
            title="提示"
            :show-close="false"
            v-model="allSelectOpen"
            :close-on-click-modal="false"
            width="500px"
            append-to-body
        >
            <div style="text-align: center">
                <el-radio-group v-model="selectRadio">
                    <el-radio label="current" size="large">选中当前页</el-radio>
                    <el-radio label="all" size="large">选中所有页({{ pageData.total }})</el-radio>
                </el-radio-group>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="allSelConfirm">确 定</el-button>
                    <el-button @click="allSelCancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss">
.query-list__pager {
    margin-top: 15px;
    min-height: 36px;
}

.query-selection-bar {
    position: relative;
    margin: 0 0 10px;
    padding: 6px 68px 5px 20px;
    background-color: rgba(#2476e0, 0.1);
    border: 1px solid rgba(#2476e0, 0.4);
    border-radius: 2px;
    color: #333;

    .query-selection-bar__text {
        margin: 0 6px;
        color: #2476e0;
    }

    .query-selection-bar__clear {
        color: #2476e0;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
}
</style>
