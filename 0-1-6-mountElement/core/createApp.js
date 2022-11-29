import { effectWatch } from './reactivity.js'
import { mountElement } from './renderer.js'

export function createApp(rootComponent) {
  // app
  return {
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      effectWatch(() => {
        rootContainer.textContent = ''
        const subTree = rootComponent.render(setupResult)
        mountElement(subTree, rootContainer)
      })
    }
  }
}
