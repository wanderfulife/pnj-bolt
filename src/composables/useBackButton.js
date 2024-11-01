import { App } from '@capacitor/app'
import { onMounted, onUnmounted } from 'vue'

export function useBackButton() {
  let backButtonListener = null

  function handleBackButton(callback) {
    backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
      const handled = callback()
      
      if (!handled) {
        if (canGoBack) {
          window.history.back()
        } else {
          App.exitApp()
        }
      }
    })
  }

  onUnmounted(() => {
    backButtonListener?.remove()
  })

  return {
    handleBackButton
  }
}