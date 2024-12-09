import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom";
import './App.module.scss'
import Header from '../Header/Header';

import Home from '../../pages/Home/Home';
import DeviceInfo from '../../pages/Device/Device';
import Authorisation from '../Authorisation/Authorisation';
import { useAuth } from '../../context/AuthContext';

function App() {
  const { token } = useAuth();


  return (
    <Router>
      <Header />
      <Routes>
        {/* Авторизация */}
        <Route path="/login" element={<Authorisation />} />

        {/* Защищённые маршруты */}
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/device/:id"
          element={token ? <DeviceInfo /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  )
}

export default App


