import React from 'react';
import DevicesList from '../../components/DevicesList/DevicesList';
import Map from '../../components/Map/Map'
import { GetDevicesList } from '../../context/GetDevicesList';
import style from "./Home.module.scss";



export default function Home() {
  return (
    <GetDevicesList>
      <div className={style.homeContainer}>
        <Map/>
        <DevicesList />
      </div>
    </GetDevicesList>
  );
}
