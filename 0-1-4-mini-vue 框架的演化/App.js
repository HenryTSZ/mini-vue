import { reactive } from './core/index.js'

export const App = {
  render(context) {
    const element = document.createElement('div')
    const nameText = document.createTextNode(`姓名：${context.user.name} \r`)
    const ageText = document.createTextNode(`年龄：${context.user.age}`)
    element.appendChild(nameText)
    element.appendChild(ageText)
    return element
  },
  setup() {
    const user = reactive({ name: 'HenryTSZ', age: 10 })
    window.user = user
    return { user }
  }
}
