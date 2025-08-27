// SensorsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SensorsContext = createContext();

export const useSensors = () => {
  const context = useContext(SensorsContext);
  if (!context) {
    throw new Error('useSensors must be used within a SensorsProvider');
  }
  return context;
};

export const SensorsProvider = ({ children }) => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // axios instance
  const api = axios.create({
    baseURL: 'http://localhost:5001',
  });

  // автоматически подставляем токен в каждый запрос
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("👉 Отправляем токен:", token);  // временно
    } else {
      console.warn("❌ Токен не найден в localStorage");
    }
    return config;
  });
  

  // ---- API функции ----

  const fetchSensors = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/sensors');
      setSensors(response.data);
      console.log('что приходит в fetchSensors в сенсорКонтекст: ', response.data);
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка загрузки датчиков';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateOrCreateSensor = async (devEui, sensorData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/sensors/${devEui}`, sensorData);
      
      // Обновляем локальное состояние
      setSensors((prev) => {
        const existingIndex = prev.findIndex((s) => s.devEui === devEui);
        if (existingIndex >= 0) {
          // Обновляем существующий
          const updated = [...prev];
          updated[existingIndex] = response.data;
          return updated;
        } else {
          // Добавляем новый
          return [...prev, response.data];
        }
      });
      
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка сохранения датчика';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateSensorCoordinates = async (devEui, coordinates) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put(`/sensors/${devEui}/coordinates`, coordinates);
      setSensors((prev) => prev.map((s) => (s.devEui === devEui ? response.data : s)));
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка обновления координат';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteSensor = async (devEui) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/sensors/${devEui}`);
      setSensors((prev) => prev.filter((s) => s.devEui !== devEui));
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка удаления датчика';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSensorByDevEui = (devEui) => sensors.find((s) => s.devEui === devEui);

  const clearError = () => setError(null);

  // при монтировании тянем список
  useEffect(() => {
    fetchSensors();
  }, []);

  return (
    <SensorsContext.Provider
      value={{
        sensors,
        loading,
        error,
        fetchSensors,
        updateOrCreateSensor, 
        updateSensorCoordinates,
        deleteSensor,
        getSensorByDevEui,
        clearError,
      }}
    >
      {children}
    </SensorsContext.Provider>
  );
};
