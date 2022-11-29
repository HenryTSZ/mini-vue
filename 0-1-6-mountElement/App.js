import { reactive, h } from './core/index.js'

export const App = {
  render(context) {
    // return h('div', { id: 'test', class: 'demo' }, 'HenryTSZ')
    return h('div', { id: 'test', class: 'demo' }, [
      h('span', {}, `姓名：${context.user.name} \r`),
      h('span', {}, `年龄：${context.user.age}`)
    ])
  },
  setup() {
    const user = reactive({ name: 'HenryTSZ', age: 10 })
    window.user = user
    return { user }
  }
}
