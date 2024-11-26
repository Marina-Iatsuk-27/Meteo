import React from 'react';
import DevicesList from '../../components/DevicesList/DevicesList';
import Authorisation from '../../components/Authorisation/Authorisation';
import { GetDevicesList } from '../../context/GetDevicesList';


export default function Home() {
  return (
    <GetDevicesList>
      <div>
        <DevicesList />
        <Authorisation />

      </div>
    </GetDevicesList>
  );
}
