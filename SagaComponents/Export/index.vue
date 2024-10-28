<template>
  <div class="saga-export">
    <el-dropdown @command="handleExportCommand">
      <el-button :disabled="disabled" plain type="primary"
        >导出 <el-icon><ArrowDown /></el-icon
      ></el-button>
      <template #dropdown>
        <el-dropdown-menu slot-name="dropdown" class="dark-item">
          <el-dropdown-item command="all">全部导出</el-dropdown-item>
          <el-dropdown-item command="some">勾选导出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dialog
      title="导出"
      v-model="dialogVisable"
      :append-to-body="true"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="600px"
    >
      <div class="saga-export__inner">
        <div v-show="status === 1" class="export-column">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0" />
          <el-checkbox-group v-model="checkedColumn" @change="handleCheckedColumnChange">
            <el-checkbox v-for="(label, key) in column" :key="key" :label="key">
              <span class="column-name" :title="label">{{ label }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-show="status === 2" class="export-progress">
          <div class="export-progress__inner">
            <el-progress :stroke-width="10" :percentage="percentage > 100 ? 100 : percentage" />
          </div>
        </div>
        <div v-show="status === 3" class="export-result">
          <div class="export-result__message" :class="{ success: result.success }">
            <el-icon v-if="result.success"><CircleCheckFilled /></el-icon>
            <el-icon v-else><CircleCloseFilled /></el-icon>
            {{ result.message }}
          </div>
          <div v-if="result.attach" class="download-res-list">
            <el-link type="primary" target="_blank" :href="result.attach">下载文件</el-link>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-show="status !== 3" @click="handleClose">取 消</el-button>
          <el-button :loading="loading" type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ArrowDown, CircleCheckFilled, CircleCloseFilled } from "@element-plus/icons-vue"

export default {
  name: "SagaExport",
  emits: ["refresh"],
  inject: {
    configProvider: "configProvider",
  },
  props: {
    columnAction: {
      type: Function,
      required: true,
    },
    exportAction: {
      type: Function,
      required: true,
    },
    queryAction: {
      type: Function,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checkList: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
    idKey: {
      type: String,
      default: "ids",
    },
    valueKey: {
      type: String,
      default: "id",
    },
  },
  components: {
    ArrowDown,
    CircleCheckFilled,
    CircleCloseFilled,
  },
  data() {
    return {
      dialogVisable: false,
      isIndeterminate: false,
      checkAll: false,
      loading: false,
      checkedColumn: [],
      command: "",
      column: {},
      status: 1,
      percentage: 0,
      timer: null,
      queryTimer: null,
      result: {
        success: false,
        message: "导出完成！ ",
        attach: "",
      },
    }
  },
  computed: {
    localQueryAction() {
      return this.queryAction || this.configProvider.offlineTaskStatusQuery
    },
  },
  beforeUnmount() {
    if (this.queryTimer) {
      clearTimeout(this.queryTimer)
    }
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  methods: {
    handleExportCommand(command) {
      if (command === "some" && this.checkList.length === 0) {
        return this.$message.warning("请勾选需要导出的数据")
      }
      this.command = command
      this.setColumn()
    },
    handleCheckAllChange(val) {
      this.checkedColumn = val ? Object.keys(this.column) : []
      this.isIndeterminate = false
    },
    handleCheckedColumnChange(value) {
      let checkedCount = value.length
      const kets = Object.keys(this.column)
      this.checkAll = checkedCount === kets.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < kets.length
    },

    async handleSubmit() {
      // 已经导出成功，不再进行提交
      if (this.status === 3) {
        this.handleClose()
        return false
      }

      if (this.checkedColumn.length === 0) {
        return this.$message.warning("请勾选需要导出的列")
      }

      this.easeProgress()
      this.status = 2
      this.loading = true

      const params = Object.assign({}, this.data, {
        [this.idKey]: this.checkList.map(el => el[this.valueKey]).join(","),
        fieldNames: this.checkedColumn.join(","),
      })

      if (this.command === "all") {
        delete params[this.idKey]
      }

      try {
        const { data } = await this.exportAction(params)
        if (data.offline) {
          this.queryTaskStatus(data.taskId)
        } else {
          this.exportSuccess(data.downloadUrl)
        }
      } catch (error) {
        this.exportError()
      }
    },

    // 查询离线导出是否完成
    queryTaskStatus(taskId) {
      this.localQueryAction(taskId).then(({ data }) => {
        if (data.downloadUrl) {
          this.exportSuccess(data.downloadUrl)
        } else {
          // 判断是否失败
          if (data.status.value === 3) {
            this.exportError(data.stauts.text)
            return false
          }
          this.queryTimer = setTimeout(() => {
            this.queryTaskStatus(taskId)
          }, 1000)
        }
      })
    },

    exportSuccess(downloadUrl) {
      clearTimeout(this.timer)
      this.percentage = 100
      this.$emit("refresh")
      this.loading = false
      setTimeout(() => {
        this.status = 3
        this.result = {
          success: true,
          message: "导出成功",
          attach: downloadUrl,
        }
      }, 1000)
    },

    exportError(msg) {
      this.loading = false
      this.status = 3
      this.result = {
        success: false,
        message: msg || "导出失败",
        attach: "",
      }
    },

    handleClose() {
      if (this.queryTimer) {
        clearTimeout(this.queryTimer)
      }
      this.checkedColumn = []
      this.column = {}
      this.status = 1
      this.percentage = 0
      this.isIndeterminate = false
      this.checkAll = false
      this.dialogVisable = false
      this.loading = false
    },

    async setColumn() {
      this.dialogVisable = true
      const { data } = await this.columnAction()
      this.column = data
    },
    open() {
      this.dialogVisable = true
    },
    easeProgress() {
      if (this.percentage === 100) {
        return
      }
      if (this.percentage++ < 89) {
        this.timer = setTimeout(() => {
          this.easeProgress()
        }, 200 + this.percentage * 5)
      }
    },
  },
}
</script>

<style lang="scss">
.saga-export {
  display: inline-block;
}
.saga-export__inner {
  .export-wrap {
    text-align: center;
  }
  .export-progress {
    &__inner {
      text-align: center;
      width: 400px;
      margin: 0 auto;
      padding: 20px 0;
    }
    .file-name {
      margin-bottom: 15px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .export-result__message {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 20px;
    font-size: 16px;

    &.success {
      .el-icon {
        color: #50ad5e;
      }
    }
    .el-icon {
      font-size: 18px;
      color: #dd3939;
      margin-right: 5px;
    }
  }
  .download-res-list {
    text-align: center;
    margin-top: 10px;
  }
  .export-column {
    .el-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      > .el-checkbox {
        width: 33%;
        margin-right: 0;
        margin-bottom: 15px;
        .column-name {
          margin-top: -3px;
          display: inline-block;
          vertical-align: middle;
          white-space: nowrap;
          word-break: break-all;
          max-width: 120px;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
