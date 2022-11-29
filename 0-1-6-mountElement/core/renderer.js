// 自定义渲染器
function createElement(tag) {
  return document.createElement(tag)
}

function patchProps(el, key, prevValue, nextValue) {
  el.setAttribute(key, nextValue)
}

function createTextNode(text) {
  return document.createTextNode(text)
}

function insert(el, parent) {
  parent.append(el)
}

export function mountElement(vnode, container) {
  const { tag, props, children } = vnode
  console.log('🚀 ~ file: renderer.js ~ line 12 ~ mountElement ~ tag', tag)

  // 处理 tag
  const el = createElement(tag)

  // 处理 props
  for (const key in props) {
    if (Object.hasOwnProperty.call(props, key)) {
      const value = props[key]
      // 首次渲染没有 prevValue
      patchProps(el, key, null, value)
    }
  }

  // 处理 children
  if (typeof children === 'string') {
    insert(createTextNode(children), el)
  } else if (Array.isArray(children)) {
    children.forEach(child => {
      mountElement(child, el)
    })
  }

  // insert
  insert(el, container)
}
