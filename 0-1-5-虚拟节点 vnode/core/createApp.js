import { effectWatch } from './reactivity.js'

export function createApp(rootComponent) {
  // app
  return {
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      effectWatch(() => {
        rootContainer.textContent = ''
        const subTree = rootComponent.render(setupResult)
        console.log('ð ~ file: createApp.js ~ line 11 ~ effectWatch ~ subTree', subTree)
        // ç±äº subTree ä¸æ¯çå®ç Domï¼æ æ³æ·»å ï¼åæ³¨éæ
        // rootContainer.appendChild(element)
      })
    }
  }
}
