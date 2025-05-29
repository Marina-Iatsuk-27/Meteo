import React, { useContext, useEffect } from "react";
import { DevicesListContext } from "../../context/GetDevicesList";
import { Link } from 'react-router-dom'; 
import style from "./DevicesList.module.scss"

export default function DevicesList({ setFilteredDevices }) {
  console.log("запуск списка");
  const { devicesList } = useContext(DevicesListContext);
  console.log('devicesList',devicesList);

  // Фильтрация устройств по наличию слов "Ground" и "meteo" в name
  const filteredDevices = devicesList.filter(device => /meteo|ground/i.test(device.name) //test - регулярное выражение /meteo|ground/i проверяет наличие слов 'meteo' или 'ground' в свойстве name каждого объекта device, и флаг i делает проверку независимой от регистра.
  );

  console.log('filteredDevices',filteredDevices);
   // Передача отфильтрованных устройств наверх. монтирование 1 раз
   useEffect(() => {
    setFilteredDevices(filteredDevices);
  }, []);



  return (
    <div className={style.deviceListContainer}>
    <h3>Список устройств:</h3>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Имя датчика</th>
          <th>ID</th>
          <th>Описание</th>
        </tr>
      </thead>
      <tbody>
        {filteredDevices.map((device, index) => (
          <tr key={device.id}>
            <td>{index + 1}</td>
            <td><Link key={device.id} to={`/device/${device.id}`}>
                    {device.name}
                  </Link></td>
            <td>{device.id}</td>
            <td>{device.description || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
    
  );
}


