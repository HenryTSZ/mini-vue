## 0-1-8-diff(2)

我们接着来处理 `children` 的 `diff`

### 实现 children 的 diff

`newChildren` 的值有两种：`string` 或 `array`，而 `oldChildren` 也是这两种

那两两组合就有 4 种情况：

1. new -> string, old -> string
2. new -> string, old -> array
3. new -> array, old -> string
4. new -> array, old -> array

先来看新的值是 `string` 的处理逻辑：

如果老的值也是 `string`，那么只需要比较一下是否相等，不等的话就修改 `innerText` 即可

而如果老的值是 `array`，那么直接修改 `innerText` 即可

```js
const oldChildren = n1.children
const newChildren = n2.children

if (typeof newChildren === 'string') {
  if (typeof oldChildren === 'string') {
    if (newChildren !== oldChildren) {
      el.innerText = newChildren
    }
  } else if (Array.isArray(oldChildren)) {
    el.innerText = newChildren
  }
}
```

先测试第一种情况：

```js
// test new -> string, old -> string
// user.children = 'Henry'
render(context) {
  return h('div', {}, context.user.children)
},
setup() {
  const user = reactive({ name: 'HenryTSZ', age: 10, children: 'HenryTSZ' })
  window.user = user
  return { user }
}
```

没有问题，多次修改也正常，而且值不变时，`Dom` 未更新

再测试第二种情况：

```js
// test new -> string, old -> array
// user.children = 'Henry'
render(context) {
  return h('div', {}, context.user.children)
},
setup() {
  const user = reactive({
    name: 'HenryTSZ',
    age: 10,
    children: [h('div', {}, 'HenryTSZ'), h('div', {}, '10')]
  })
  window.user = user
  return { user }
}
```

没有问题，多次修改也正常，而且值不变时，`Dom` 未更新

然后再来看新的值是 `array` 的处理逻辑

如果老的值是 `string`，那么我们可以先清空 `innerText`，然后调用 `mountElement` 重新渲染就可以了

```js
if (Array.isArray(newChildren)) {
  if (typeof oldChildren === 'string') {
    el.innerText = ''
    newChildren.forEach(child => {
      mountElement(child, el)
    })
  }
}
```

由于我们需要在控制台使用 `h`，所以也需要绑定到 `window` 上

```js
window.h = h
```

测试一下

```js
// test new -> array, old -> string
// user.children = [h('div', {}, 'Henry'), h('div', {}, '10')]
render(context) {
  return h('div', {}, context.user.children)
},
setup() {
  const user = reactive({
    name: 'HenryTSZ',
    age: 10,
    children: 'HenryTSZ'
  })
  window.user = user
  return { user }
}
```

测试也没有问题

然后看最后一种情况，这种情况就比较复杂了

我们先列出可能的情况：

1. 新老数组个数相同，那我们依次比较即可
2. 新的数组个数大于老的，那就执行 add
3. 新的数组个数小于老的，那就执行 remove

当然我们都是默认新老数组的顺序一致的，要做到完美，就需要使用 `key` 来比较，那个我们可以在深入学习 `Vue3` 源码时学习，这里就先简单处理一下

我们可以先找到新老数组的公共长度，依次对比，然后对多出来或少了的执行 `remove` 或 `add`

`add` 我们可以调用 `mountElement`，但 `remove` 还需要提取一个方法

```js
function remove(el, parent) {
  parent.removeChild(el)
}
```

```js
if (Array.isArray(oldChildren)) {
  const len = Math.min(oldChildren.length, newChildren.length)

  // 依次对比
  for (let i = 0; i < len; i++) {
    diff(oldChildren[i], newChildren[i])
  }

  // add
  if (newChildren.length > len) {
    for (let i = len; i < newChildren.length; i++) {
      mountElement(newChildren[i], el)
    }
  }

  // remove
  if (oldChildren.length > len) {
    for (let i = len; i < oldChildren.length; i++) {
      remove(oldChildren[i].el, el)
    }
  }
}
```

测试一下

```js
// test new -> array, old -> array
// user.children = [h('div', {}, 'Henry'), h('div', {}, '11')]
// user.children = [h('div', {}, 'Henry'), h('div', {}, '10'), h('div', {}, 'hello')]
// user.children = [h('div', {}, 'Henry')]
render(context) {
  return h('div', {}, context.user.children)
},
setup() {
  const user = reactive({
    name: 'HenryTSZ',
    age: 10,
    children: [h('div', {}, 'Henry'), h('div', {}, '10')]
  })
  window.user = user
  return { user }
}
```

没有问题

至此我们就完成了 `mini-vue`
