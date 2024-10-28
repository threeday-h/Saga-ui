import ConfigProvider from "./ConfigProvider/index.vue"
import QueryList from "./QueryList/index.vue"
import MediaUpload from "./MediaUpload/index.vue"
import FileUpload from "./FileUpload/index.vue"
import Import from "./Import/index.vue"
import Search from "./Search/index.jsx"
import DialogForm from "./DialogForm/index.jsx"
import DateRange from "./DateRange/index.vue"
import FoldButtons from "./FoldButtons/index.jsx"
import PhotoWall from "./PhotoWall/index.vue"

const components = [
    QueryList,
    MediaUpload,
    FileUpload,
    ConfigProvider,
    Import,
    Search,
    DialogForm,
    DateRange,
    FoldButtons,
    PhotoWall
]

const install = function (app) {
    components.forEach(component => {
        app.component(component.name, component)
    })
}

export default {
    install,
    QueryList,
    MediaUpload,
    FileUpload,
    ConfigProvider,
    Import,
    Search,
    DialogForm,
    DateRange,
    FoldButtons,
    PhotoWall
}