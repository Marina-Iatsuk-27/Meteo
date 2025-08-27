// pages/MapPage/MapPage.jsx
import { useState } from 'react';
import Map from '../../components/Map/Map';
import { GetDevicesList } from '../../context/GetDevicesList';
import { SensorsProvider } from '../../context/SensorsContext';

export default function MapPage() {
  const token = localStorage.getItem('token'); // токен от авторизации

  return (
    <SensorsProvider token={token}>
      <GetDevicesList>
        <Map />
      </GetDevicesList>
    </SensorsProvider>
  );
}
