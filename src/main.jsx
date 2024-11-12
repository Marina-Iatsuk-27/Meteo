import React from 'react'
import './assets/index.css'
// import { GetDeviceInfo } from './context/GetDeviceInfo' //оборачиваем им все приложение
import { GetDeviceHistory } from './context/GetDeviceHistory' //оборачиваем им все приложение
import { GetDevicesList } from './context/GetDevicesList' //оборачиваем им все приложение
import App from './components/App/App'
import ReactDOM from 'react-dom/client'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <GetDevicesList> */}
    {/* <GetDeviceHistory> */}
    {/* <GetDeviceInfo> */}
    <App />
    {/* </GetDeviceInfo> */}
    {/* </GetDeviceHistory> */}
    {/* </GetDevicesList> */}
  </React.StrictMode>,
)
