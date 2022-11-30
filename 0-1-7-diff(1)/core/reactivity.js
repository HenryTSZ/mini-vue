export class Dep {
  constructor(value) {
    this._value = value
    this.effects = new Set()
  }

  get value() {
    this.depend()
    return this._value
  }

  set value(value) {
    this._value = value
    this.notice()
  }

  depend() {
    if (currentEffect) {
      this.effects.add(currentEffect)
    }
  }

  notice() {
    this.effects.forEach(effect => {
      effect()
    })
  }
}

let currentEffect = null

export function effectWatch(fn) {
  currentEffect = fn
  fn()
  currentEffect = null
}

const targetsMap = new Map()

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key) {
      const dep = getDep(target, key)
      dep.depend()
      return Reflect.get(target, key)
    },
    set(target, key, value) {
      const result = Reflect.set(target, key, value);
      const dep = getDep(target, key)
      dep.notice()
      return result
    }
  })
}

function getDep(target, key) {
  let depMap = targetsMap.get(target)
  if (!depMap) {
    depMap = new Map()
    targetsMap.set(target, depMap)
  }
  let dep = depMap.get(key)
  if (!dep) {
    // 这里我们就不需要传入值了，因为通过 target[key] 就可以拿到
    // 这里只是使用它的依赖收集及触发功能
    dep = new Dep()
    depMap.set(key, dep)
  }
  return dep
}
