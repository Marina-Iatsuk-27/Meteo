import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup, useMap } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";


const DeviceMap = () => {


  
//статичный датчик (координаты)
  const data =[
    {
      name: 'датчик1',
  deduplicationId:"3ca93046-e2ed-4c89-becb-873b848ca211",
  time:"2024-12-05T12:16:12.941515461+00:00",
  location:{
    latitude:44.60744,
    longitude:33.51541,
    altitude:33.515411376953125
    }
  },
  {
    name: 'датчик2',
    deduplicationId:"43e3b8f2-4f2a-490c-8543-c65ab49a28cc",
time:"2024-12-05T12:36:34.792639860+00:00",
    location:{
      latitude:44.61644,
      longitude:33.52821,
      altitude:1033.515411376953125
      }
    },
    {
      name: 'датчик3',
      deduplicationId:"43e3b8f2-4f2a-490c-8543-c65ab49a28cc",
  time:"2024-12-05T12:36:34.792639860+00:00",
      location:{
        latitude: 44.64340,
        longitude: 33.56610,
        altitude: 1033.515411376953125
    }
      }
]

const [selectedSensor, setSelectedSensor] = useState(null);

  // Компонент для управления картой (перемещение к выбранному датчику)
  const FlyToSensor = ({ sensor }) => {
    const map = useMap();

    if (sensor) {
      map.flyTo(
        [sensor.location.latitude, sensor.location.longitude],
        15, // Уровень зума
        { duration: 1.5 } // Анимация (в секундах)
      );
    }
    return null;
  };
  // Настраиваем иконку устройства
  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448636.png", // Замените на свою иконку
    iconSize: [50, 50],
  });

  return (
    <div style={{ display: "flex" }}>
      {/* Боковая панель */}
      <div
        style={{
          width: "200px",
          padding: "10px",
          backgroundColor: "#f7f7f7",
          borderRight: "1px solid #ddd",
        }}
      >
        <h3>Устройства</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {data.map((sensor) => (
           
            <li key={sensor.deduplicationId} style={{ marginBottom: "10px" }}>
              <button
                style={{
                  padding: "8px 10px",
                  width: "100%",
                  backgroundColor: "#7fa480",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedSensor(sensor)}
              >
                {sensor.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Карта */}
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[44.61, 33.52]} // Центр карты
          zoom={10} // Уровень масштаба
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          {data.map((sensor) => (
            <Marker
              key={sensor.deduplicationId}
              position={[
                sensor.location.latitude,
                sensor.location.longitude,
              ]}
              icon={customIcon}
            >
              <Popup>
                <div>
                  <h4>{sensor.name}</h4>
                  <p><b>ID:</b> {sensor.deduplicationId}</p>
                  <p><b>Time:</b> {sensor.time}</p>
                  <p><b>Altitude:</b> {sensor.location.altitude} m</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* FlyToSensor компонент */}
          <FlyToSensor sensor={selectedSensor} />
        </MapContainer>
      </div>
    </div>
  );
};

export default DeviceMap;
