import { useState } from 'react';
import DevicesList from '../../components/DevicesList/DevicesList';
import InfoDashboard from '../../components/InfoDashboard/InfoDashboard';
import Map from '../../components/Map/Map'

import { GetDevicesList } from '../../context/GetDevicesList';
import style from "./Home.module.scss";



export default function Home() {
   const [filteredDevices, setFilteredDevices] = useState([]);
  return (
    <GetDevicesList>
      <div className={style.homeContainer}>
      <InfoDashboard filteredDevices={filteredDevices} />
        <Map filteredDevices={filteredDevices}/>
        <DevicesList setFilteredDevices={setFilteredDevices} />
        
      </div>
    </GetDevicesList>
  );
}
