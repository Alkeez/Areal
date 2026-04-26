import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, Notify } from 'quasar'
import router from './router'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(Quasar, {
  config: {},
  plugins: {
    Notify
  }
})

app.use(router)
app.mount('#app')