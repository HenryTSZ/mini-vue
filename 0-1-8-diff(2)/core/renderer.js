// 自定义渲染器
function createElement(tag) {
  return document.createElement(tag)
}

function patchProps(el, key, prevValue, nextValue) {
  if (nextValue === null) {
    el.removeAttribute(key)
    return
  }
  el.setAttribute(key, nextValue)
}

function createTextNode(text) {
  return document.createTextNode(text)
}

function insert(el, parent) {
  parent.append(el)
}

function remove(el, parent) {
  parent.removeChild(el)
}

export function mountElement(vnode, container) {
  const { tag, props, children } = vnode

  // 处理 tag
  const el = (vnode.el = createElement(tag))

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

/**
 * diff
 * @param {vnode} n1 oldSubTree
 * @param {vnode} n2 subTree
 */
export function diff(n1, n2) {
  const el = (n2.el = n1.el)
  if (n1.tag !== n2.tag) {
    const newEl = createElement(n2.tag)
    el.replaceWith(newEl)
    n2.el = newEl
  } else {
    const oldProps = n1.props
    const newProps = n2.props

    // add / update
    if (newProps) {
      for (const key in newProps) {
        if (Object.hasOwnProperty.call(newProps, key)) {
          const newValue = newProps[key]
          const oldValue = oldProps[key]
          if (newValue !== oldValue) {
            patchProps(el, key, oldValue, newValue)
          }
        }
      }
    }

    // remove
    if (oldProps) {
      for (const key in oldProps) {
        if (Object.hasOwnProperty.call(oldProps, key)) {
          if (!(key in newProps)) {
            patchProps(el, key, oldProps[key], null)
          }
        }
      }
    }

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
    } else if (Array.isArray(newChildren)) {
      if (typeof oldChildren === 'string') {
        el.innerText = ''
        newChildren.forEach(child => {
          mountElement(child, el)
        })
      } else if (Array.isArray(oldChildren)) {
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
    }
  }
}
