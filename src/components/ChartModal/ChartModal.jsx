import React, { useState, useEffect } from 'react';
import GETHISTORY from '../../Services/GETHISTORY'; // Импортируем сервис
import DashboardHistory from '../DashboardHistory/DashboardHistory';
import style from './ChartModal.module.scss';
import Loader from "../Loader/Loader";

const ChartModal = ({ device, metric, onClose }) => {
  console.log('device',device);
  console.log('metric',metric);
  
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  // if (loading) {
  //     return <Loader text="Загружаем данные..." />;
  //   }

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const history = await GETHISTORY.getDevice(device.devEui);
        
        const filteredHistory = history.filter(item => item.devEui === device.devEui);
        const isMeteo = device.deviceName.toLowerCase().includes('meteo');
        const isGround = device.deviceName.toLowerCase().includes('ground');

        const preparedData = filteredHistory.map(item => {
          if (isMeteo) return { ...item, value: item[metric] };
          if (isGround) {
            try {
              const parsed = JSON.parse(item.raw_data);
              return {
                ...item,
                value: parsed.object?.[metric] ?? null,
                time: parsed.time || item.time
              };
            } catch {
              return { ...item, value: null };
            }
          }
          return { ...item, value: null };
        });

        setChartData(preparedData);
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [device, metric]);

  return (
    <>
      {/* Лоадер поверх всего */}
      {loading && (
        <div className={style.loadingOverlay}>
          <Loader text="Загружаем историю по показателю" />
        </div>
      )}
      
      {/* Модальное окно */}
      <div className={style.modalOverlay} onClick={onClose}>
        <div className={style.modalContent} onClick={e => e.stopPropagation()}>
          <button className={style.closeButton} onClick={onClose}>×</button>
          <h2>{device.deviceName} - {metric}</h2>
          
          <div className={style.chartContainer}>
            <DashboardHistory 
              deviceHistory={chartData} 
              isMeteo={device.deviceName.toLowerCase().includes('meteo')} 
              isGround={device.deviceName.toLowerCase().includes('ground')}
              singleMetric={metric}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChartModal;