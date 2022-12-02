import { reactive, h } from './core/index.js'

window.h = h

export const App = {
  // // test new -> string, old -> string
  // // user.children = 'Henry'
  // render(context) {
  //   return h('div', {}, context.user.children)
  // },
  // setup() {
  //   const user = reactive({ name: 'HenryTSZ', age: 10, children: 'HenryTSZ' })
  //   window.user = user
  //   return { user }
  // }
  //---------------------------------------------------------------------
  // // test new -> string, old -> array
  // // user.children = 'Henry'
  // render(context) {
  //   return h('div', {}, context.user.children)
  // },
  // setup() {
  //   const user = reactive({
  //     name: 'HenryTSZ',
  //     age: 10,
  //     children: [h('div', {}, 'HenryTSZ'), h('div', {}, '10')]
  //   })
  //   window.user = user
  //   return { user }
  // }
  //---------------------------------------------------------------------
  // // test new -> array, old -> string
  // // user.children = [h('div', {}, 'Henry'), h('div', {}, '10')]
  // render(context) {
  //   return h('div', {}, context.user.children)
  // },
  // setup() {
  //   const user = reactive({
  //     name: 'HenryTSZ',
  //     age: 10,
  //     children: 'HenryTSZ'
  //   })
  //   window.user = user
  //   return { user }
  // }
  //---------------------------------------------------------------------
  // // test new -> array, old -> array
  // // user.children = [h('div', {}, 'Henry'), h('div', {}, '11')]
  // // user.children = [h('div', {}, 'Henry'), h('div', {}, '10'), h('div', {}, 'hello')]
  // // user.children = [h('div', {}, 'Henry')]
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
}
