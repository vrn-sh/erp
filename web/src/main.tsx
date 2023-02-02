import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import "./main.scss"
import { BrowserRouter } from 'react-router-dom'
import './fonts/SF-pro.ttf'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
