## 0-1-4-mini-vue 框架的演化

上一节我们完成了 `Vue3` 的雏形，但与我们实际使用还是有点区别的

首先我们不会主动调用 `App.render(App.setup())`，也不会操作 `Dom`，也没有使用 `effectWatch`

分析一下，这些其实在所有的组件内都会被执行，所以我们需要将其抽离到框架中，而我们只写自定义的东西就可以了

### 回顾 Vue3 的写法

我们在 `main.js` 中引入 `createApp` 并调用：

```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
```

### 演化框架

#### 搭建架子

由上面的写法可知，我们需要暴露一个 `createApp` 函数，接收一个 `App` 根组件，并且返回一个对象，里面有一个 `mount` 函数，接收一个字符串，通过该字符串可以找到一个页面的 `Dom`

那首先我们把这个结构写一下：

```js
export function createApp(rootComponent) {
  // app
  return {
    mount(rootContainer) {}
  }
}
```

这里 `return` 出去的就是我们的 `app`，虽然目前还比较简陋

`mount` 目前我们先接收一个 `Dom` 节点，先简单处理一下

然后我们在这里调用一下 `App.render(App.setup())`

```js
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      rootComponent.render(setupResult)
    }
  }
}
```

然后使用一下：

```js
import { reactive, effectWatch, createApp } from './core/index.js'

const App = {
  render(context) {
    effectWatch(() => {
      const app = document.getElementById('app')
      app.textContent = ''
      const element = document.createElement('div')
      const nameText = document.createTextNode(`姓名：${context.user.name} \r`)
      const ageText = document.createTextNode(`年龄：${context.user.age}`)
      element.appendChild(nameText)
      element.appendChild(ageText)
      app.appendChild(element)
    })
  },
  setup() {
    const user = reactive({ name: 'HenryTSZ', age: 10 })
    window.user = user
    return { user }
  }
}

createApp(App).mount(document.getElementById('app'))
```

测试运行正常

#### 抽离 App

我们实际使用时，`App` 是引入的，所以需要把 `App` 抽离出去：

```js
import { createApp } from './core/index.js'
import { App } from './App.js'

createApp(App).mount(document.getElementById('app'))
```

#### 抽离 effectWatch

然后再把 `effectWatch` 抽离一下

由于以前我们是在 `render` 中使用的 `effectWatch`，而现在在 `createApp` 中 `render` 是从外部传入的，我们无法把 `effectWatch` 写在 `render` 里面了

但其实我们可以把 `render` 写在 `effectWatch` 中，实际效果是一致的，都可以触发依赖收集与触发

```js
mount(rootContainer) {
  const setupResult = rootComponent.setup()
  effectWatch(() => {
    rootComponent.render(setupResult)
  })
}
```

因为这里 `effectWatch` 会执行回调函数，然后会执行 `rootComponent.render`，这里就会触发 `get` 方法了

测试运行正常

#### 抽离操作 Dom 逻辑

目前清空 `Dom` 及 `appendChild` 仍在 `App` 中，还需要把这些操作抽离到 `createApp` 中

```js
effectWatch(() => {
  rootContainer.textContent = ''
  const element = rootComponent.render(setupResult)
  rootContainer.appendChild(element)
})
```

所以 `render` 中还需要把 `element` 返回出去：

```js
render(context) {
  const element = document.createElement('div')
  const nameText = document.createTextNode(`姓名：${context.user.name} \r`)
  const ageText = document.createTextNode(`年龄：${context.user.age}`)
  element.appendChild(nameText)
  element.appendChild(ageText)
  return element
}
```

目前我们的使用方式就更接近 `Vue3` 了
