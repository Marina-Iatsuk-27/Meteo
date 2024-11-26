import { createContext, useEffect, useState,useContext } from "react";
import { useParams } from 'react-router-dom';
import GETHISTORY from "../Services/GETHISTORY";
import Loader from "../components/Loader/Loader"


export const DeviceHistoryContext = createContext(); // Создаем контекст

export function GetDeviceHistory({ children }) {
    const [deviceHistory, setdeviceHistory] = useState(false); // Состояние для хранения данных устройства
    const { id } = useParams(); // Получаем id из URL

    const value = { deviceHistory, setdeviceHistory };
    useEffect(() => {
        if (id) {
            getDeviceServer(id);
        }
    }, [id]); // Запускается только один раз при монтировании компонента

    async function getDeviceServer(id) {
        const data = await GETHISTORY.getDevice(id); // Получаем данные устройства

        // console.log(data);
        setdeviceHistory(data); // Сохраняем данные в состоянии
       
    }
  


    if (!deviceHistory) {
        return <Loader text="Загружаем историю устройства..."/>;; 
    }

    return (
        <DeviceHistoryContext.Provider value={value}>
            {children}
        </DeviceHistoryContext.Provider>
    ); // Возвращаем провайдер контекста
}

export default GetDeviceHistory; // Экспортируем компонент
