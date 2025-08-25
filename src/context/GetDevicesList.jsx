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
            const filtered = data.filter(device => {
                const isCorrectName = /meteo|ground/i.test(device.deviceName);
                //test - регулярное выражение /meteo|ground/i проверяет наличие слов 'meteo' или 'ground' в свойстве name каждого объекта device, и флаг i делает проверку независимой от регистра.
            //console.log("отфильтрованные устройства:", filtered);
    
                // проверка на служебный пакет
                let isServicePacket = false;
    
                // 1. Иногда сервер уже отдает object
                if (device?.object?.message === "служебный пакет") {
                    isServicePacket = true;
                }
    
                // 2. Иногда это только в raw_data
                if (!isServicePacket && device?.raw_data) {
                    try {
                        const parsed = JSON.parse(device.raw_data);
                        if (parsed?.object?.message === "служебный пакет") {
                            isServicePacket = true;
                        }
                    } catch (e) {
                        console.warn("Ошибка парсинга raw_data:", e);
                    }
                }
    
                return isCorrectName && !isServicePacket;
            });
    
            // 2. Делаем объект по devEui (последнее имя перезапишет предыдущее)
            const uniqueByDevEui = {};
            filtered.forEach(device => {
                uniqueByDevEui[device.devEui] = device;
            });
    
            // 3. Возвращаем массив только уникальных устройств
            const uniqueDevices = Object.values(uniqueByDevEui);
    
            setdevicesList(uniqueDevices);
        } else {
            setdevicesList([]);
        }
    }
    
console.log("devicesList in get device",devicesList);


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