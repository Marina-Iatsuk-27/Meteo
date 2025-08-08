import React, { useContext } from "react";
import { DevicesListContext } from "../../context/GetDevicesList";
import { Link } from 'react-router-dom'; 
import style from "./DevicesList.module.scss";

export default function DevicesList() {
  console.log("запуск списка");

  const { devicesList } = useContext(DevicesListContext);
  console.log('devicesList в DevicesList', devicesList);

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
          {devicesList.map((device, index) => (
            <tr key={device.devEui}>
              <td>{index + 1}</td>
              <td>
                <Link to={`/device/${device.devEui}`}>
                  {device.deviceName}
                </Link>
              </td>
              <td>{device.devEui}</td>
              <td>{device.description || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
