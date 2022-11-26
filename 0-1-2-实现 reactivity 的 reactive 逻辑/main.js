// import { reactive, effect } from '../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js'

// const user = reactive({ age: 10 })
// let nextAge = 0

// effect(() => {
//   nextAge = user.age + 1
//   console.log(nextAge)
// })

// user.age++

import { reactive, effectWatch } from './core/index.js'

const user = reactive({ age: 10 })
let nextAge = 0

effectWatch(() => {
  nextAge = user.age + 1
  console.log(nextAge)
})

user.age++
