import { defineComponent, watch, ref, onBeforeUpdate } from "vue"
import { slice } from "lodash-es"
import { ArrowDown } from "@element-plus/icons-vue"

const fold = defineComponent({
  name: "SagaFoldButtons",
  props: {
    items: {
      type: Number,
      default: 2,
    },
    foldText: {
      type: String,
      default: "更多",
    },
  },
  components: {
    ArrowDown,
  },
  setup(props, { slots }) {
    let links = ref([])
    let flatLinks = ref([])
    let foldLinks = ref([])

    function buildVnodes() {
      links.value = slots.default().filter(el => el.children !== "v-if")
      if (links.value.length > props.items) {
        flatLinks.value = slice(links.value, 0, props.items)
        foldLinks.value = slice(links.value, props.items)
      } else {
        flatLinks.value = links.value
        foldLinks.value = []
      }
    }

    buildVnodes()

    onBeforeUpdate(() => {
      buildVnodes()
    })

    return () => {
      return (
        <div className="saga-fold-buttons">
          {flatLinks.value}
          {foldLinks.value.length ? (
            <el-popover
              v-slots={{
                default: () => <div className="saga-fold-buttons__dropdown">{foldLinks.value}</div>,
                reference: () => (
                  <el-link type="primary">
                    {props.foldText}
                    <el-icon>
                      <ArrowDown />
                    </el-icon>
                  </el-link>
                ),
              }}
              width="auto"
              popper-class="saga-fold-buttons__popper"
              placement="bottom-start"
              trigger="click"
            ></el-popover>
          ) : (
            ""
          )}
        </div>
      )
    }
  },
})

export default fold
