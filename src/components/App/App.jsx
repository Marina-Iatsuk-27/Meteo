import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import './App.scss'
import Header from '../Header/Header';

import Home from '../../pages/Home/Home';
import DeviceInfo from '../../pages/Device/Device';
import Authorisation from '../Authorisation/Authorisation';
import Library from '../../pages/Library/Library';
import { useAuth } from '../../context/AuthContext';
import GetDeviceHistory from '../../context/GetDeviceHistory';

function App() {
  const { token } = useAuth();


  return (
    
    <Router>
      <Header />
      <Routes>
        {/* Авторизация */}
        {/* <Route path="/login" element={<Authorisation />} /> */}

        {/* Защищённые маршруты */}
        {/* <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        /> */}
        <Route
          path="/"
          element={ <Home /> }
        />
        {/* <Route
          path="/device/:id"
          element={token ? <DeviceInfo /> : <Navigate to="/login" replace />}
        /> */}
        <Route
          path="/device/:id"
          element={ <DeviceInfo /> }
        />
        {/* <Route
          path="/library"
          element={token ? <Library /> : <Navigate to="/login" replace />}
        /> */}
        <Route
          path="/library"
          element={ <Library /> }
        />
      </Routes>
    </Router>
  )
}

export default App


