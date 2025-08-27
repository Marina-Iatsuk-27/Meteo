// Home.jsx
import { useState } from 'react';
import DevicesList from '../../components/DevicesList/DevicesList';
import InfoDashboard from '../../components/InfoDashboard/InfoDashboard';
import { GetDevicesList } from '../../context/GetDevicesList';
import style from "./Home.module.scss";

export default function Home() {
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  return (
    <>
      <div className={style.title}>
        <h1>Система мониторинга</h1>
      </div>
      
      {/* Раскомментируйте при необходимости */}
      {/* <div className={style.infoNote}>
        Добро пожаловать в систему АгроМониторинг! Здесь вы можете отслеживать все важные показатели почвы и воздуха для вашего хозяйства в режиме реального времени.
      </div> */}

      <GetDevicesList>
        <div className={style.homeContainer}>
          {/* Сайдбар с списком устройств */}
          <aside className={style.sidebar}>
            <DevicesList 
              setFilteredDevices={setFilteredDevices}
              onDeviceSelect={setSelectedDevice}
              compact={true}
            />
          </aside>

          {/* Основное содержимое с дашбордом */}
          <main className={style.mainContent}>
            <InfoDashboard 
              filteredDevices={filteredDevices}
              selectedDevice={selectedDevice}
            />
          </main>
        </div>
      </GetDevicesList>
    </>
  );
}