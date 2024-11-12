import React from 'react';
import DevicesList from '../../components/DevicesList/DevicesList';
import { GetDevicesList } from '../../context/GetDevicesList';

export default function Home() {
  return (
    <GetDevicesList>
      <div>
        <DevicesList />
      </div>
    </GetDevicesList>
  );
}
