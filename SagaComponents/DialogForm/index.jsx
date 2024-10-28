import { defineComponent, toRaw, onMounted, ref } from "vue"
import { cloneDeep, isArray, isObject, has, merge } from "lodash-es"
import { ElMessage, ElMessageBox } from "element-plus"

const form = defineComponent({
    name: "SagaDialogForm",
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String
        },
        top: {
            type: String,
            default: "15vh"
        },
        width: {
            type: String,
            default: "800px"
        },
        labelWidth: {
            type: String,
            default: "120px"
        },
        modelValue: { type: Object, default: () => ({}) },
        submit: {
            type: Function,
            required: true
        },
        rules: {
            type: Object,
            default: () => ({})
        },
        safety: {
            type: Boolean,
            default: false
        },
        submitClose: {
            type: Boolean,
            default: true
        }
    },
    emits: ["update:visible", "update:modelValue", "validateFail"],
    setup(props, { emit, slots, expose }) {
        let modelValueOrigin = {}
        const form = ref(null)
        const loading = ref(false)

        function handleSync(visible) {
            emit("update:visible", visible)
        }

        async function handleSubmit() {
            try {
                await form.value.validate()
            } catch (error) {
                emit("validateFail")
                return false
            }

            loading.value = true

            try {
                const { msg: message = "操作成功" } = await props.submit(cloneDeep(props.modelValue))

                loading.value = false

                ElMessage({
                    message,
                    type: "success"
                })
                if (props.submitClose) {
                    handleClose()
                } else {
                    resetForm()
                }
            } catch (error) {
                loading.value = false
            }
        }

        function handleClose() {
            handleBeforeClose(() => {
                emit("update:visible", false)
            })
        }

        function getBaseValue(val) {
            if (isArray(val)) {
                return []
            } else if (isObject(val)) {
                return {}
            } else {
                return ""
            }
        }

        async function handleBeforeClose(done) {
            if (props.safety) {
                try {
                    await ElMessageBox.confirm("确认要关闭吗？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                } catch (error) {
                    console.warn(error)
                }
            }
            done()
            resetForm()
        }

        async function resetForm() {
            const nowData = cloneDeep(props.modelValue)
            const newData = {}
            for (const key in nowData) {
                if (!has(modelValueOrigin, key)) {
                    newData[key] = getBaseValue(nowData[key])
                }
            }
            emit("update:modelValue", Object.assign({}, newData, cloneDeep(modelValueOrigin)))
            setTimeout(() => {
                form.value?.clearValidate()
            }, 50)
        }

        onMounted(() => {
            modelValueOrigin = cloneDeep(toRaw(props.modelValue))
        })

        expose({ form })

        return () => {
            return (
                <div>
                    <el-dialog
                        title={props.title}
                        width={props.width}
                        top={props.top}
                        append-to-body
                        close-on-press-escape={false}
                        destroy-on-close={true}
                        close-on-click-modal={false}
                        draggable
                        modelValue={props.visible}
                        onUpdate:modelValue={handleSync}
                        before-close={handleBeforeClose}
                        v-slots={{
                            default: () => (
                                <el-form
                                    ref={form}
                                    model={props.modelValue}
                                    rules={props.rules}
                                    validate-on-rule-change={false}
                                    labelWidth={props.labelWidth}
                                >
                                    {slots.default()}
                                </el-form>
                            ),
                            footer: () => (
                                <span>
                                    <el-button onClick={handleClose}>取 消</el-button>
                                    <el-button loading={loading.value} onClick={handleSubmit} type="primary">
                                        确 定
                                    </el-button>
                                </span>
                            )
                        }}
                    ></el-dialog>
                </div>
            )
        }
    }
})

export default form
