import { reactive, effectWatch } from './core/index.js'

// const user = reactive({ name: 'HenryTSZ', age: 10 })
// window.user = user

// effectWatch(() => {
//   const app = document.getElementById('app')
//   app.textContent = ''
//   const element = document.createElement('div')
//   const nameText = document.createTextNode(`姓名：${user.name} \r`)
//   const ageText = document.createTextNode(`年龄：${user.age}`)
//   element.appendChild(nameText)
//   element.appendChild(ageText)
//   app.appendChild(element)
// })

const App = {
  render(context) {
    effectWatch(() => {
      const app = document.getElementById('app')
      app.textContent = ''
      const element = document.createElement('div')
      const nameText = document.createTextNode(`姓名：${context.user.name} \r`)
      const ageText = document.createTextNode(`年龄：${context.user.age}`)
      element.appendChild(nameText)
      element.appendChild(ageText)
      app.appendChild(element)
    })
  },
  setup() {
    const user = reactive({ name: 'HenryTSZ', age: 10 })
    window.user = user
    return { user }
  }
}

App.render(App.setup())
