# 简介

Saga components 是欧圣达燃气业务线常用业务组件集合，组件剥离自各业务系统。旨在帮助提升业务开发效率，统一交互、UI 风格。

## 安装

由于 saga-components 发布在公司的 [npm](http://192.168.6.52:4873/) 私服仓库，所以首先需要检查项目的仓库设置是否正确，推荐使用`.npmrc`文件进行管理。

### 示例

```bash
# 指定npm仓库地址
registry=http://192.168.6.52:4873/
```

### 安装组件库

```
npm install saga-components -S
```

## 开始使用

```javascript
import { createApp } from "vue"

import App from "./App.vue"
import SagaComponents from "@osdiot/saga-components"

const app = createApp(App)

app.use(SagaComponents)
app.mount("#app")
```
