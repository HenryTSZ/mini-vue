import { effectWatch } from './reactivity.js'

export function createApp(rootComponent) {
  // app
  return {
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      effectWatch(() => {
        rootContainer.textContent = ''
        const subTree = rootComponent.render(setupResult)
        console.log('🚀 ~ file: createApp.js ~ line 11 ~ effectWatch ~ subTree', subTree)
        // 由于 subTree 不是真实的 Dom，无法添加，先注释掉
        // rootContainer.appendChild(element)
      })
    }
  }
}
