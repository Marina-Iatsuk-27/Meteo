import React, { useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import geo from "../../assets/icons/icons8-location-48.png";
import styles from "./Map.module.scss";
import { DevicesListContext } from "../../context/GetDevicesList";

const DeviceMap = () => {
  const { devicesList } = useContext(DevicesListContext);
  const [selectedSensor, setSelectedSensor] = useState(null);

  // Иконка маркера
  const customIcon = new L.Icon({
    iconUrl: geo,
    iconSize: [50, 50],
  });

  // Плавный перелёт к выбранному сенсору
  const FlyToSensor = ({ sensor }) => {
    const map = useMap();
    if (sensor) {
      map.flyTo([sensor.latitude, sensor.longitude], 18, { duration: 2 });
    }
    return null;
  };

  // Берём последнее чтение по каждому устройству
  const devicesWithLatestData = devicesList.map(device => {
    const latest = device.lastReadings[0]; // последний пакет
    return {
      devEui: device.devEui,
      deviceName: device.deviceName,
      ...latest // spread, чтобы вытащить temperature, humidity и т.д.
    };
  });
  // Функция для небольшого смещения координат, чтобы точка не была одной
const offsetCoordinates = (latitude, longitude, index) => {
  const offset = 0.0003; // ~30 метров
  // Чтобы смещение было стабильным, например:
  const latOffset = ((index % 3) - 1) * offset; // -offset, 0, +offset
  const lngOffset = (Math.floor(index / 3) % 3 - 1) * offset; // -offset, 0, +offset
  return [latitude + latOffset, longitude + lngOffset];
};

  return (
    <div className={styles.mapContainer}>
      {/* Сайдбар */}
      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>Устройства</h3>
        <ul className={styles.sensorList}>
          {devicesWithLatestData.map(sensor => (
            <li key={sensor.devEui} className={styles.sensorItem}>
              <button
                className={styles.sensorButton}
                onClick={() => setSelectedSensor(sensor)}
              >
                {sensor.deviceName}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Карта */}
      <div className={styles.map}>
        <MapContainer
          center={[44.61, 33.52]}
          zoom={10}
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0 5px 9px rgba(0, 0, 0, 0.1)"
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {devicesWithLatestData.map((sensor, index) => {
            const coords = offsetCoordinates(sensor.latitude, sensor.longitude, index);
            const lat = coords[0];
            const lng = coords[1];
            return (
              <Marker
                key={sensor.devEui}
                position={[lat, lng]}  // вот тут обязательно используем сдвинутые координаты
                icon={customIcon}
              >
                <Popup>
                  <div className={styles.popupContainer}>
                    <h4 className={styles.header}>{sensor.deviceName}</h4>
                    <p className={styles.id}>
                      <b>DevEUI:</b> {sensor.devEui}
                    </p>
                    <div>
                      {/* <h5 className={styles.sectionTitle}>Показатели:</h5>
                      <ul className={styles.list}>
                        {sensor.conductivity !== null && (
                          <li><b>Проводимость:</b> {sensor.conductivity}</li>
                        )}
                        {sensor.humidity !== null && (
                          <li><b>Влажность:</b> {sensor.humidity}</li>
                        )}
                        {sensor.nitrogen !== null && (
                          <li><b>Азот:</b> {sensor.nitrogen}</li>
                        )}
                        {sensor.ph !== null && (
                          <li><b>pH:</b> {sensor.ph}</li>
                        )}
                        {sensor.phosphorus !== null && (
                          <li><b>Фосфор:</b> {sensor.phosphorus}</li>
                        )}
                        {sensor.potassium !== null && (
                          <li><b>Калий:</b> {sensor.potassium}</li>
                        )}
                        {sensor.temperature !== null && (
                          <li><b>Температура:</b> {sensor.temperature}</li>
                        )}
                        {sensor.pressure !== null && (
                          <li><b>Давление:</b> {sensor.pressure}</li>
                        )}
                        {sensor.rainfall !== null && (
                          <li><b>Осадки:</b> {sensor.rainfall}</li>
                        )}
                      </ul> */}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}


          <FlyToSensor sensor={selectedSensor} />
        </MapContainer>
      </div>
    </div>
  );
};

export default DeviceMap;
