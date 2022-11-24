// import { ref, effect } from '../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js'

// const a = ref(10)
// let b

// effect(() => {
//   // 收集依赖
//   b = a.value + 10
//   console.log('🚀 ~ file: main.js ~ line 8 ~ effect ~ b', b)
// })

// 触发依赖
// a.value = 20

import { Dep, effectWatch } from './core/index.js'

const a = new Dep(10)
let b

effectWatch(() => {
  b = a.value + 10
  console.log('🚀 ~ file: main.js ~ line 22 ~ effectWatch ~ b', b)
})

a.value = 20
