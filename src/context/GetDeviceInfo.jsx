import { createContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import GETINFO from "../Services/GETINFO";
import Loader from "../components/Loader/Loader"

export const MeteoInfoContext = createContext();

export function GetDeviceInfo({ children }) {
    const [deviceData, setDeviceData] = useState(false);
    const { id } = useParams(); // Получаем id из URL

    const value = { deviceData, setDeviceData };

    useEffect(() => {
        if (id) {
            getDeviceServer(id);
        }
    }, [id]);

    async function getDeviceServer(id) { // Принимаем id как аргумент
        const data = await GETINFO.getDevice(id);
        setDeviceData(data);
    }

    if (!deviceData) {
        return <Loader text="Загружаем информацию устройства..."/>;
    }

    return (
        <MeteoInfoContext.Provider value={value}>
            {children}
        </MeteoInfoContext.Provider>
    );
}

export default GetDeviceInfo;
