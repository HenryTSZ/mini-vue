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
      return effect()
    })
  }
}

let currentEffect = null

export function effectWatch(fn) {
  currentEffect = fn
  fn()
  currentEffect = null
}
