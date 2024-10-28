import { defineComponent, ref, onUnmounted, onMounted, nextTick, watchEffect } from "vue"
import "./search.scss"
import { ArrowUp, ArrowDown } from "@element-plus/icons-vue"

import { debounce } from "lodash-es"

const search = defineComponent({
  name: "SagaSearch",
  props: {
    gutter: { type: Number, default: 20 },
    isCollapse: { type: Boolean, default: false },
    modelValue: { type: Object, default: () => ({}) },
    rules: { type: Object, default: () => ({}) },
    listRef: Object,
  },
  components: {
    ArrowUp,
    ArrowDown,
  },
  setup(props, { slots, emit, expose }) {
    const collapse = ref(props.isCollapse)
    const formItems = ref([])
    const visibleFormItems = ref([])
    const form = ref(null)
    const totalSpan = ref(0)

    const screenModeMap = {
      xl: 1920,
      lg: 1200,
      md: 992,
    }
    const screenMode = ref("")
    const defaultSpan = { md: 12, lg: 8, xl: 6 }

    const getScreenWidth = debounce(() => {
      const screenWidth = window.innerWidth
      for (const key in screenModeMap) {
        const value = screenModeMap[key]
        if (screenWidth >= value || key === "md") {
          screenMode.value = key
          break
        }
      }
    }, 300)

    function handleCollapseClick() {
      collapse.value = !collapse.value
    }

    async function onSubmit() {
      if (props.listRef) {
        await props.listRef.query()
      }
      emit("submit")
      
    }

    async function onReset() {
      form.value.resetFields()
      await nextTick()
      if (props.listRef) {
        await props.listRef?.query()
      }
      emit("reset")
    }

    function resetForm() {
      form.value.resetFields()
    }

    expose({
      submit: onSubmit,
      reset: onReset,
      resetForm,
    })

    onMounted(() => {
      getScreenWidth()
      window.addEventListener("resize", getScreenWidth)
    })

    onUnmounted(() => {
      window.removeEventListener("resize", getScreenWidth)
    })

    formItems.value =
      slots.default?.({
        submit: onSubmit,
        reset: onReset,
      }) || []

    watchEffect(() => {
      totalSpan.value = formItems.value.reduce((prev = 0, { props }) => {
        return prev + ((props?.[screenMode.value] || 0) || defaultSpan[screenMode.value] || 0)
      }, 0)

      visibleFormItems.value = []
      if (collapse.value) {
        let currentSpan = 0

        for (let i = 0; i < formItems.value.length; i++) {
          if(formItems.value[i].props) {
            const item = formItems.value[i]
            visibleFormItems.value.push(item)
  
            currentSpan += (item.props[screenMode.value] || 0) || defaultSpan[screenMode.value]
            if (currentSpan >= 24 - defaultSpan[screenMode.value]) {
              break
            }
          }
        }
      } else {
        visibleFormItems.value = formItems.value
      }
    })

    return () => {
      return (
        <div className="saga-search">
          <el-form ref={form} model={props.modelValue} onSubmit={(event)=>event.preventDefault()} rules={props.rules} inline>
            <el-row gutter={props.gutter}>
              {visibleFormItems.value.map(vnode => {
                if (vnode.props) {
                  const { md = defaultSpan.md, lg = defaultSpan.lg, xl = defaultSpan.xl } = vnode.props
                  return (
                    <el-col  md={md} lg={lg} xl={xl}>
                      {vnode}
                    </el-col>
                  )
                }
              })}
              <el-col span={defaultSpan[screenMode.value] || 6} style="margin-left: auto;">
                <div className="handle-group">
                  <el-button onClick={onReset}>重置</el-button>
                  <el-button onClick={onSubmit} type="primary">
                    查询
                  </el-button>
                  {totalSpan.value > 24 ? (
                    <el-button type="primary" text onClick={handleCollapseClick}>
                      {collapse.value ? "展开" : "收起"}
                      <el-icon>{collapse.value ? <ArrowDown /> : <ArrowUp />}</el-icon>
                    </el-button>
                  ) : (
                    ""
                  )}
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
      )
    }
  },
})

export default search
