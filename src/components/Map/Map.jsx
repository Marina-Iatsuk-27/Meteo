import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import geo from '../../assets/icons/icons8-location-48.png';

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.scss";

const DeviceMap = ({ filteredDevices }) => {
  console.log('filteredDevices в мэпе: ', filteredDevices);


  const [selectedSensor, setSelectedSensor] = useState(null);

  const FlyToSensor = ({ sensor }) => {
    const map = useMap();

    if (sensor) {
      map.flyTo(
        [sensor.state.uplink.rxInfo[0].location.latitude,
        sensor.state.uplink.rxInfo[0].location.longitude],
        18, // Уровень зума
        { duration: 2 } // Анимация (в секундах)
      );
    }
    return null;
  };

  const customIcon = new L.Icon({
    iconUrl: geo,
    iconSize: [50, 50],
  });

  

  return (
    <div className={styles.mapContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}></h3>
        <ul className={styles.sensorList}>
          {filteredDevices.map((sensor) => (
            <li key={sensor._id} className={styles.sensorItem}>
              <button
                className={styles.sensorButton}
                onClick={() => setSelectedSensor(sensor)}
              >
                {sensor.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Map */}
      <div className={styles.map}>
        <MapContainer
          center={[44.61, 33.52]}
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          {filteredDevices.map((sensor) => (
            <Marker
              key={sensor._id}
              position={[
                sensor.state.uplink.rxInfo[0].location.latitude,
                sensor.state.uplink.rxInfo[0].location.longitude,
              ]}
              icon={customIcon}
            >
             <Popup>
    <div className={styles.popupContainer}>
      <h4 className={styles.header}>{sensor.state.uplink.deviceInfo.deviceName}</h4>
      <p className={styles.id}>
        <b>ID:</b> {sensor.id}
      </p>
      <div>
        <h5 className={styles.sectionTitle}>Показатели:</h5>
        <ul className={styles.list}>
          {sensor.state.uplink.object.conductivity && (
            <li className={styles.listItem}>
              <b>Проводимость:</b> {sensor.state.uplink.object.conductivity}
            </li>
          )}
          {sensor.state.uplink.object.humidity && (
            <li className={styles.listItem}>
              <b>Влажность:</b> {sensor.state.uplink.object.humidity}
            </li>
          )}
          {sensor.state.uplink.object.nitrogen && (
            <li className={styles.listItem}>
              <b>Азот:</b> {sensor.state.uplink.object.nitrogen}
            </li>
          )}
          {sensor.state.uplink.object.ph && (
            <li className={styles.listItem}>
              <b>ph:</b> {sensor.state.uplink.object.ph}
            </li>
          )}
          {sensor.state.uplink.object.phosphorus && (
            <li className={styles.listItem}>
              <b>Фосфор:</b> {sensor.state.uplink.object.phosphorus}
            </li>
          )}
          {sensor.state.uplink.object.potassium && (
            <li className={styles.listItem}>
              <b>Калий:</b> {sensor.state.uplink.object.potassium}
            </li>
          )}
          {sensor.state.uplink.object.temperature && (
            <li className={styles.listItem}>
              <b>Температура:</b> {sensor.state.uplink.object.temperature}
            </li>
          )}
          {sensor.state.uplink.object.pressure && (
            <li className={styles.listItem}>
              <b>Атмосферное давление:</b> {sensor.state.uplink.object.pressure}
            </li>
          )}
          {sensor.state.uplink.object.rainfall && (
            <li className={styles.listItem}>
              <b>Осадки:</b> {sensor.state.uplink.object.rainfall}
            </li>
          )}
        </ul>
      </div>
    </div>
  </Popup>

            </Marker>
          ))}

          <FlyToSensor sensor={selectedSensor} />
        </MapContainer>
      </div>
    </div>
  );
};

export default DeviceMap;
