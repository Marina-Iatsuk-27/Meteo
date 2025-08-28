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
  const sensorInfo = sensors.find(s => s.deveui === device.devEui);
  const recentReadings = device.lastReadings.slice(0, 3); // Берем последние 3 чтения

   // console.log('Данные из devicesList:', devicesList);
  // console.log('Данные из sensorInfo:', sensorInfo);

  // Функция для поиска значения в raw_data
  const findValueInRawData = (readings, field) => {
    for (const reading of readings) {
      try {
        const rawData = JSON.parse(reading.raw_data);
        const objectData = rawData.object || {};
        
        // Ищем значение в object (разные возможные форматы)
        if (objectData[field] !== null && objectData[field] !== undefined && objectData[field] !== "undefined") {
          // Преобразуем строковые числа в числа
          const value = objectData[field];
          return typeof value === 'string' && !isNaN(value) ? parseFloat(value) : value;
        }
      } catch (e) {
        console.error('Ошибка парсинга raw_data:', e);
      }
    }
    return null;
  };

  // Функция для поиска значения в основном объекте или raw_data
  const findValue = (readings, field) => {
    // Сначала ищем в основном объекте
    for (const reading of readings) {
      if (reading[field] !== null && reading[field] !== undefined) {
        return reading[field];
      }
    }
    
    // Если не нашли в основном объекте, ищем в raw_data
    return findValueInRawData(readings, field);
  };

  // Базовые данные из первого (самого свежего) чтения
  const baseData = recentReadings[0] || {};

  return {
    devEui: device.devEui,
    deviceName: device.deviceName,
    latitude: sensorInfo?.latitude || null,
    longitude: sensorInfo?.longitude || null,
    // Данные из самого свежего чтения
    id: baseData.id || null,
    deduplicationId: baseData.deduplicationId || null,
    time: baseData.time || null,
    applicationName: baseData.applicationName || null,
    raw_data: baseData.raw_data || null,
    // Ищем значения в последних чтениях (основной объект + raw_data)
    temperature: findValue(recentReadings, 'temperature'),
    humidity: findValue(recentReadings, 'humidity'),
    pressure: findValue(recentReadings, 'pressure'),
    ph: findValue(recentReadings, 'ph'),
    conductivity: findValue(recentReadings, 'conductivity')
  };
});


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
  // Функция для преобразования ключей в читаемые названия
    const getFieldLabel = (key) => {
      const labels = {
        temperature: 'Температура',
        humidity: 'Влажность',
        pressure: 'Давление',
        ph: 'pH',
        conductivity: 'Электропроводность',
        rainfall: 'Осадки',
        windSpeed: 'Скорость ветра',
        windDirection: 'Направление ветра',
        batteryVoltage: 'Напряжение батареи'
        // добавьте другие поля по необходимости
      };
      return labels[key] || key;
    };

    // Функция для форматирования значений
    const formatValue = (key, value) => {
      if (typeof value === 'number') {
        // Для числовых значений добавляем единицы измерения
        const units = {
          temperature: '°C',
          humidity: '%',
          pressure: ' hPa',
          ph: '',
          conductivity: ' µS/cm',
          rainfall: ' mm',
          windSpeed: ' m/s',
          batteryVoltage: ' V'
        };
        return `${value}${units[key] || ''}`;
      }
      return value;
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
                  {device.deviceName} 
                </button>

                {!hasCoordinates && (
                  <button
                    className={styles.coordButton}
                    onClick={() =>
                      openCoordinatesForm({
                        mode: "update",
                        devEui: device.devEui,
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
                        deviceName: device.deviceName,
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
                  
                  {/* Динамически отображаем все доступные показатели */}
                  <div className={styles.measurements}>
                    {Object.entries(device)
                      .filter(([key, value]) => 
                        // Пропускаем системные поля и электропроводность
                        !['devEui', 'deviceName', 'id', 'deduplicationId', 'time', 
                          'applicationName', 'raw_data', 'latitude', 'longitude', 'conductivity'].includes(key) &&
                        value !== null && value !== undefined && value !== ''
                      )
                      .map(([key, value]) => (
                        <p key={key} className={styles.measurement}>
                          <b>{getFieldLabel(key)}:</b> {formatValue(key, value)}
                        </p>
                      ))
                    }
                  </div>
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
