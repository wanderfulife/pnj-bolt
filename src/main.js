import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Gestionnaire d'erreurs global
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue Error:', err);
  console.error('Error Info:', info);
}

app.use(pinia)
app.use(router)

app.mount('#app')