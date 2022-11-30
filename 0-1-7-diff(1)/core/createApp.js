import { effectWatch } from './reactivity.js'
import { mountElement, diff } from './renderer.js'

export function createApp(rootComponent) {
  // app
  return {
    mount(rootContainer) {
      const setupResult = rootComponent.setup()
      let prevSubTree = null
      let isMounted = false

      effectWatch(() => {
        if (isMounted) {
          const subTree = rootComponent.render(setupResult)
          // console.log('oldSubTree:', prevSubTree)
          // console.log('newSubTree:', subTree)
          diff(prevSubTree, subTree)
          prevSubTree = subTree
        } else {
          isMounted = true
          const subTree = rootComponent.render(setupResult)
          prevSubTree = subTree
          mountElement(subTree, rootContainer)
        }
      })
    }
  }
}
