## 0-1-6-mountElement

这一小节我们来实现一下把虚拟节点转换为真实节点

### 分析 mountElement

我们调用 `mountElement` 来转换，接收两个参数：虚拟节点 (vnode) 和 容器 (container)

我们在 `createApp` 中调用一下：

```js
const subTree = rootComponent.render(setupResult)
mountElement(subTree, rootContainer)
```

然后创建一个 `renderer.js` 文件

```js
export function mountElement(vnode, container) {
  const { tag, props, children } = vnode
  // 处理 tag
  // 处理 props
  // 处理 children
}
```

### 处理 tag

这个就比较简单了：

```js
const el = document.createElement(tag)
```

我们可以看到这个其实是一个 `创建的动作`，而我们还可以抽离为 `创建`，这样就可以支持跨平台了，我不管你是啥平台，我把 `tag` 给你，至于创建的动作我不关心，你只要返回结果就 ok 了

比如我们现在是浏览器环境，创建就使用 `document.createElement`:

```js
// 自定义渲染器
function createElement(tag) {
  return document.createElement(tag)
}

export function mountElement(vnode, container) {
  const { tag, props, children } = vnode

  const el = createElement(tag)
}
```

这样，如果你要跨平台时，只需要覆盖 `createElement`，重写里面的逻辑就可以了，这样就达到一个跨平台的效果

## 处理 insert

到这里我们先测试一下，小步验证一下

需要把 `el` 添加到容器中：

```js
// insert
container.append(el)
```

为了适配跨平台，我们也需要将其抽离成一个跨平台的方法：

```js
function insert(el, parent) {
  parent.append(el)
}
```

```js
// insert
insert(el, container)
```

页面 `Dom` 结果：

```html
<div id="app"><div></div></div>
```

可以看到 `div` 节点已经添加到页面了

### 处理 props

`props` 是一个对象，那我们使用 `for in` 处理就可以了：

```js
// 处理 props
for (const key in props) {
  if (Object.hasOwnProperty.call(props, key)) {
    const value = props[key]
    el.setAttribute(key, value)
  }
}
```

我们也需要将其抽离成一个跨平台的方法

注：抽离的方法都是参考 `Vue3` 命名的，方便后面看源码

```js
function patchProps(el, key, prevValue, nextValue) {
  el.setAttribute(key, nextValue)
}
```

```js
for (const key in props) {
  if (Object.hasOwnProperty.call(props, key)) {
    const value = props[key]
    patchProps(el, key, null, value)
  }
}
```

然后再小步验证一下：

```html
<div id="app"><div></div></div>
```

发现属性没有加上去，看代码发现我们就没有传属性，只是传了一个空对象，加一个 `id: 'text'`：

```js
return h('div', { id: 'test' }, [
  h('span', {}, `姓名：${context.user.name} \r`),
  h('span', {}, `年龄：${context.user.age}`)
])
```

页面 `Dom` 结果：

```html
<div id="app"><div id="test"></div></div>
```

多个 `props` 也是可以的

### 处理 children

我们以前分析过 `children` 的类型：`string || []`，要么是一个简单的文本，要么是多文本数组

我们先小步走，完成 `string` 的情况：

先传入 `string`

```js
return h('div', { id: 'test', class: 'demo' }, 'HenryTSZ')
```

```js
// 处理 children
if (typeof children === 'string') {
  const textNode = document.createTextNode(children)
  insert(textNode, el)
}
```

需要把创建 `textNode` 的方法也抽离一下：

```js
function createTextNode(text) {
  return document.createTextNode(text)
}
```

```js
if (typeof children === 'string') {
  insert(createTextNode(children), el)
}
```

测试也没有问题：

```html
<div id="app"><div id="test" class="demo">HenryTSZ</div></div>
```

然后我们再处理一下数组的情况，由于数组每一项都是一个独立的虚拟节点，所以我们直接循环调用 `mountElement` 就可以了

```js
return h('div', { id: 'test', class: 'demo' }, [
  h('span', {}, `姓名：${context.user.name} \r`),
  h('span', {}, `年龄：${context.user.age}`)
])
```

```js
// 处理 children
if (typeof children === 'string') {
  insert(createTextNode(children), el)
} else if (Array.isArray(children)) {
  children.forEach(child => {
    mountElement(child, el)
  })
}
```

测试也没有问题：

```html
<div id="app">
  <div id="test" class="demo"><span>姓名：HenryTSZ </span><span>年龄：10</span></div>
</div>
```

这里需要注意一下：如果 `children` 传入的是一个 `number` 类型的话，是渲染不出来的，因为我们没有处理这种情况，可以转成 `string` 类型

至此我们就完成了虚拟节点到真实节点到转换

而且还抽离了对应的渲染动作，完成了跨平台的功能，不论你是渲染到浏览器平台还是渲染到别的平台，都是通用的，渲染动作是一样，只不过是调用的 `API` 不同，把变化点抽离出去，封装起来就可以了，里面的流程是不变的

下一小节我们就要去处理 `diff` 了
