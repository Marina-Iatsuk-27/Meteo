import React from 'react'
import './assets/index.css'
import App from './components/App/App'
import ReactDOM from 'react-dom/client'; 
import { AuthProvider } from './context/AuthContext';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
    <App />
    </AuthProvider>
  </React.StrictMode>,
)
