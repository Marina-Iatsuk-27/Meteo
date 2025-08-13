import { useState } from 'react';
import DevicesList from '../../components/DevicesList/DevicesList';
import InfoDashboard from '../../components/InfoDashboard/InfoDashboard';
import Map from '../../components/Map/Map'

import { GetDevicesList } from '../../context/GetDevicesList';
import GetDeviceHistory from '../../context/GetDeviceHistory';
import style from "./Home.module.scss";



export default function Home() {
   const [filteredDevices, setFilteredDevices] = useState([]);
  return (
    <>
    <div className={style.title}>
      <h1>Система мониторинга</h1>
    </div>
    <div className={style.infoNote}>
    Добро пожаловать в систему АгроМониторинг! Здесь вы можете отслеживать все важные показатели почвы и воздуха для вашего хозяйства в режиме реального времени.
    </div>
    <GetDevicesList>
 
      <div className={style.homeContainer}>
      <InfoDashboard filteredDevices={filteredDevices} />
        <Map filteredDevices={filteredDevices}/>
        <DevicesList setFilteredDevices={setFilteredDevices} />
        
      </div>
     
    </GetDevicesList></>
    
  );
}
