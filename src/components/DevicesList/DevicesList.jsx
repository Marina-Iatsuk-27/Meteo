import React, { useContext, useState, useMemo } from "react";
import { DevicesListContext } from "../../context/GetDevicesList";
import { Link } from 'react-router-dom'; 
import style from "./DevicesList.module.scss";

export default function DevicesList({ compact = false }) {
  const { devicesList } = useContext(DevicesListContext);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDevices = useMemo(() => {
    if (!searchTerm) return devicesList;
    
    return devicesList.filter(device =>
      device.deviceName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.devEui?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [devicesList, searchTerm]);

  return (
    <div className={`${style.deviceListContainer} ${compact ? style.compactMode : ''}`}>
      <h3>Устройства ({devicesList.length})</h3>
      
      <div className={style.searchContainer}>
        <input
          type="text"
          placeholder="Поиск устройств..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={style.searchInput}
        />
      </div>

      <ul className={style.list}>
        {filteredDevices.length === 0 ? (
          <li className={style.emptyState}>
            {searchTerm ? "Устройства не найдены" : "Нет устройств"}
          </li>
        ) : (
          filteredDevices.map((device, index) => (
            <li key={device.devEui} className={style.listItem}>
              <div className={style.itemContent}>
                <span className={style.itemNumber}>
                  {index + 1}
                </span>
                
                <div className={style.deviceInfo}>
                  <Link 
                    to={`/device/${device.devEui}`} 
                    className={style.deviceName}
                    title={device.deviceName}
                  >
                    {device.deviceName}
                  </Link>
                  <p className={style.deviceId} title={device.devEui}>
                    {device.devEui}
                  </p>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}