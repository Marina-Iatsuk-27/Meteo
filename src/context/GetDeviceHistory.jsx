import { createContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import GETHISTORY from "../Services/GETHISTORY";
import Loader from "../components/Loader/Loader";

export const DeviceHistoryContext = createContext(); // Создаем контекст

export function GetDeviceHistory({ children }) {
    const [deviceHistory, setDeviceHistory] = useState(null); // Используем null для начального состояния
    const { id } = useParams(); // Получаем id из URL

    const value = { deviceHistory, setDeviceHistory };

    useEffect(() => {
        if (id) {
            getDeviceServer(id);
        }
    }, [id]); // Запускается при изменении id

    async function getDeviceServer(id) {
        try {
            const data = await GETHISTORY.getDevice(id); // Получаем данные устройства
            //console.log('История:', data);

            if (Array.isArray(data) && data.length === 0) {
                // Если данные пришли, но это пустой массив
                setDeviceHistory([]); // Устанавливаем пустой массив
            } else {
                setDeviceHistory(data); // Сохраняем данные в состоянии
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setDeviceHistory([]); // Устанавливаем пустой массив в случае ошибки
        }
    }

    //console.log('deviceHistory', deviceHistory);

    if (deviceHistory === null) {
        // Если данные еще не загружены
        return <Loader text="Загружаем историю устройства..." />;
    }

    if (Array.isArray(deviceHistory) && deviceHistory.length === 0) {
        // Если данные загружены, но это пустой массив
        return (
            <div 
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    padding: '10px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    margin: '20px auto',
                    marginBottom: '20px',
                    maxWidth: '400px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
            >
                Невозможно загрузить историю (Нет данных за последние 2 месяца)
            </div>
        );
    }

    // Если данные загружены и не пустые
    return (
        <DeviceHistoryContext.Provider value={value}>
            {children}
        </DeviceHistoryContext.Provider>
    );
}

export default GetDeviceHistory; // Экспортируем компонент