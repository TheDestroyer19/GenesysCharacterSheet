import './style.css'

// With the Tauri API npm package:
import { invoke } from '@tauri-apps/api/tauri'

// Invoke the command
invoke('my_custom_command')

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`