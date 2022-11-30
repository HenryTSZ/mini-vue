import { reactive, h } from './core/index.js'

export const App = {
  // // test tag
  // // user.tag = 'p'
  // render(context) {
  //   return h(context.user.tag, {}, '')
  // },
  // setup() {
  //   const user = reactive({ name: 'HenryTSZ', age: 10, tag: 'div' })
  //   window.user = user
  //   return { user }
  // }
  //---------------------------------------------------------------------
  // // test add props
  // // user.props = { id: 'test', class: 'demo' }
  // render(context) {
  //   return h('div', context.user.props, '')
  // },
  // setup() {
  //   const user = reactive({ name: 'HenryTSZ', age: 10, props: { id: 'test' } })
  //   window.user = user
  //   return { user }
  // }
  //---------------------------------------------------------------------
  // // test update props
  // // user.props = { id: 'demo' }
  // render(context) {
  //   return h('div', context.user.props, '')
  // },
  // setup() {
  //   const user = reactive({ name: 'HenryTSZ', age: 10, props: { id: 'test' } })
  //   window.user = user
  //   return { user }
  // }
  //---------------------------------------------------------------------
  // test remove props
  // user.props = { id: 'test' }
  render(context) {
    return h('div', context.user.props, '')
  },
  setup() {
    const user = reactive({ name: 'HenryTSZ', age: 10, props: { id: 'test', class: 'demo' } })
    window.user = user
    return { user }
  }
}
