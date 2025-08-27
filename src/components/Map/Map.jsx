// components/Map/Map.jsx
import React, { useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import geo from "../../assets/icons/icons8-location-48.png";
import styles from "./Map.module.scss";
import { DevicesListContext } from "../../context/GetDevicesList";
import { useSensors } from "../../context/SensorsContext";
import CoordinatesForm from "../CoordinatesForm/CoordinatesForm";

const DeviceMap = () => {
  const { devicesList } = useContext(DevicesListContext);
  const { sensors, updateOrCreateSensor, fetchSensors } = useSensors();

  const [selectedSensor, setSelectedSensor] = useState(null);
  const [editingDevEui, setEditingDevEui] = useState(null);
  const [coordsInput, setCoordsInput] = useState({ lat: "", lng: "" });
const [coordFormData, setCoordFormData] = useState(null); // {mode, devEui, ...}
const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);

const openCoordinatesForm = (data) => {
  setCoordFormData(data);   // сохраняем данные (devEui, deviceName, mode и т.д.)
  setIsCoordModalOpen(true); // открываем модалку
};

const closeCoordinatesForm = () => {
  setCoordFormData(null);
  setIsCoordModalOpen(false);
};


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

  // Склеиваем devicesList + sensors (берём координаты только из sensors!)
const devicesWithData = devicesList.map(device => {
  const latest = device.lastReadings[0] || {};
  const sensorInfo = sensors.find(s => s.deveui === device.devEui); 
  console.log('Данные из devicesList:', devicesList);
  console.log('Данные из sensorInfo:', sensorInfo);
 
  return {
    devEui: device.devEui,
    deviceName: device.deviceName,
    latitude: sensorInfo?.latitude || null,
    longitude: sensorInfo?.longitude || null,
    // явно перечисляем нужные поля из latest
    id: latest.id,
    deduplicationId: latest.deduplicationId,
    time: latest.time,
    applicationName: latest.applicationName,
    temperature: latest.temperature,
    humidity: latest.humidity,
    pressure: latest.pressure,
    ph: latest.ph,
    conductivity: latest.conductivity,
    raw_data: latest.raw_data
    // НЕ включаем latitude и longitude из latest!
  };
});

// После цикла выведите итоговый результат
console.log('Итоговый devicesWithData:', devicesWithData);

  // Сохранение координат
  const handleSaveCoords = async (devEui) => {
    if (!coordsInput.lat || !coordsInput.lng) return;
    await updateOrCreateSensor(devEui, {
      latitude: parseFloat(coordsInput.lat),
      longitude: parseFloat(coordsInput.lng),
    });
    setEditingDevEui(null);
    setCoordsInput({ lat: "", lng: "" });
  };

  return (
  <div className={styles.mapContainer}>
    {/* Сайдбар */}
    <div className={styles.sidebar}>
      <h3 className={styles.sidebarTitle}>Устройства</h3>
      <ul className={styles.sensorList}>
        {devicesWithData.map(device => {
          const hasCoordinates = device.latitude && device.longitude;

          return (
            <li key={device.devEui} className={styles.sensorItem}>
              <div className={styles.sensorRow}>
                <button
                  className={styles.sensorButton}
                  onClick={() => setSelectedSensor(device)}
                >
                  {device.deviceName} ({device.devEui})
                </button>

                {!hasCoordinates && (
                  <button
                    className={styles.coordButton}
                    onClick={() =>
                      openCoordinatesForm({
                        mode: "update",
                        deviceName: device.deviceName,
                      })
                    }
                  >
                    📍 Задать координаты
                  </button>
                )}

                {hasCoordinates && (
                  <button
                    className={styles.coordButton}
                    onClick={() =>
                      openCoordinatesForm({
                        mode: "update",
                        devEui: device.devEui,
                        latitude: device.latitude,
                        longitude: device.longitude,
                      })
                    }
                  >
                    ✏️ Изменить координаты
                  </button>
                )}
              </div>
            </li>
          );
        })}
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

        {devicesWithData.map((device) => {
          if (!device.latitude || !device.longitude) {
            return null; // Не показываем маркеры без координат
          }

          return (
            <Marker
              key={device.devEui}
              position={[device.latitude, device.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div className={styles.popupContainer}>
                  <h4 className={styles.header}>{device.deviceName}</h4>
                  <p className={styles.id}>
                    <b>DevEUI:</b> {device.devEui}<br/>
                   </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <FlyToSensor sensor={selectedSensor} />
        <CoordinatesForm
          isOpen={isCoordModalOpen}
          onClose={closeCoordinatesForm}
          initialData={coordFormData}
          onSave={async (data) => {
            const latitude = parseFloat(String(data.latitude).replace(",", "."));
            const longitude = parseFloat(String(data.longitude).replace(",", "."));

            if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
              alert("Введите корректные числовые координаты (например 44.6123 или 44,6123).");
              return;
            }

            try {
              await updateOrCreateSensor(data.devEui, {
                deviceName: data.deviceName,
                latitude,
                longitude,
              });

              if (fetchSensors) await fetchSensors();
              closeCoordinatesForm();
            } catch (err) {
              console.error("Ошибка сохранения координат:", err);
              alert("Ошибка сохранения координат — см. консоль.");
            }
          }}
        />
      </MapContainer>
    </div>
  </div>
);
};

export default DeviceMap;
