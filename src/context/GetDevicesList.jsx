import { createContext, useEffect, useState } from "react";
import GETLIST from "../Services/GETLIST";
import Loader from "../components/Loader/Loader";

export const DevicesListContext = createContext(); // Контекст

export function GetDevicesList({ children }) {
    const [devicesList, setdevicesList] = useState(false); // Состояние

    const value = { devicesList, setdevicesList };

    useEffect(() => {
        getDevicesServer();
    }, []);

    async function getDevicesServer() {
        const data = await GETLIST.getDevicesList();

        if (data && Array.isArray(data)) {
            const filtered = data.filter(device =>/meteo|ground/i.test(device.deviceName)
            );//test - регулярное выражение /meteo|ground/i проверяет наличие слов 'meteo' или 'ground' в свойстве name каждого объекта device, и флаг i делает проверку независимой от регистра.
            //console.log("отфильтрованные устройства:", filtered);
            setdevicesList(filtered); // Сохраняем отфильтрованные данные
        } else {
            setdevicesList([]); // Если данные не валидные
        }
    }

    if (!devicesList) {
        return <Loader text="Загружаем устройства..." />;
    }

    return (
        <DevicesListContext.Provider value={value}>
            {children}
        </DevicesListContext.Provider>
    );
}

export default GetDevicesList;
