import { createContext, useEffect, useState } from "react";
import GETLIST from "../Services/GETLIST";


export const DevicesListContext = createContext(); // Создаем контекст

export function GetDevicesList({ children }) {
    const [devicesList, setdevicesList] = useState(false); // Состояние для хранения данных устройства

    const value = { devicesList, setdevicesList };

    useEffect(() => {
        getDevicesServer();
    }, []); // Запускается только один раз при монтировании компонента

    async function getDevicesServer() {
        const data = await GETLIST.getDevicesList(); // Получаем данные устройства

        // console.log(data);
        setdevicesList(data); // Сохраняем данные в состоянии
       
    }

    if (!devicesList) {
        return <h1>Загружаем список устройств...</h1>; // Пока данные загружаются, показываем сообщение
    }

    return (
        <DevicesListContext.Provider value={value}>
            {children}
        </DevicesListContext.Provider>
    ); // Возвращаем провайдер контекста
}

export default GetDevicesList; // Экспортируем компонент
