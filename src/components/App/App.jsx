import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.module.scss'
import Header from '../Header/Header';

import Home from '../../pages/Home/Home';
import DeviceInfo from '../../pages/Device/Device';

function App() {


  return (
    <Router>
    <Header/>
    {/* <Home/> */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/device/:id" element={<DeviceInfo />} /> 
    </Routes>
    </Router>
  )
}

export default App


