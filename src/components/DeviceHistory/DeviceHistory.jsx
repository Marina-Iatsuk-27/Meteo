import { useContext,useState,useEffect } from "react";
import { DeviceHistoryContext } from "../../context/GetDeviceHistory";
import style from "./DeviceHistory.module.scss";
import DashboardHistory from '../DashboardHistory/DashboardHistory';

export default function DeviceHistory() {
    const { deviceHistory = [] } = useContext(DeviceHistoryContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (deviceHistory.length > 0) {
            setIsLoading(false); // Устанавливаем флаг загрузки в false, когда данные загружены
        }
    }, [deviceHistory]);

    let deviceName = null;
    for (const entry of deviceHistory) {
        //  // Проверка на тип устройства Проверяем, существует ли путь deviceInfo.deviceName
        if (entry.uplink && entry.uplink.deviceInfo && entry.uplink.deviceInfo.deviceName) {
            deviceName = entry.uplink.deviceInfo.deviceName;

            console.log('имя девайса',deviceName);
            break; // Останавливаемся на первом найденном объекте с deviceName
        }
    }
    
    
     const isMeteo = deviceName && (deviceName.toLowerCase().includes('meteo'));
     const isGround = deviceName && deviceName.toLowerCase().includes('ground')|| deviceName.toLowerCase().includes('...5277');

     const groupedData = isMeteo ? deviceHistory.reduce((acc, entry) => {
        const roundedTime = new Date(entry.time);
        roundedTime.setSeconds(0, 0);

        const key = roundedTime.toLocaleString();

        acc[key] = {
            time: roundedTime,
            deviceName: entry.uplink?.deviceInfo?.deviceName || "-",
            temperature: entry.uplink?.object?.temperature || acc[key]?.temperature || "-",
            humidity: entry.uplink?.object?.humidity || acc[key]?.humidity || "-",
            pressure: entry.uplink?.object?.pressure || acc[key]?.pressure || "-",
            rainfall: entry.uplink?.object?.rainfall || acc[key]?.rainfall || "-",
            batteryVoltage: entry.uplink?.object?.batteryVoltage || acc[key]?.batteryVoltage || "-",
        };

        return acc;
    }, {}) : {};
    console.log("deviceHistory",deviceHistory);
    console.log("groupedData",groupedData);

    
    

    const parsedData = isMeteo ? Object.values(groupedData) : deviceHistory;

    

    return (
        <div>
            {isLoading ? (
                <p>Загрузка данных...</p>
            ) : (
                <DashboardHistory deviceHistory={parsedData} isMeteo={isMeteo} isGround={isGround} />
            )}
            <div className={style.container}>
            <h1 className={style.title}>
                {isMeteo && "История метеостанции"}
                {isGround && "История геодатчика"}
                {!isMeteo && !isGround && "История устройства"}
            </h1>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th>Время</th>
                        {isMeteo ? (
                            <>
                                <th>Температура (°C)</th>
                                <th>Влажность (%)</th>
                                <th>Давление (hPa)</th>
                                <th>Осадки (mm)</th>
                                <th>Мощность батареи (V)</th>
                            </>
                        ) : (
                            <>
                                <th>Температура (°C)</th>
                                <th>Влажность (%)</th>
                                <th>Проводимость (мкСм/см)</th>
                                <th>Азот (мг/кг)</th>
                                <th>PH</th>
                                <th>Фосфор (мг/кг)</th>
                                <th>Калий (мг/кг)</th>
                                <th>Насыщенность солей (%)</th>
                                <th>Общее растворенное вещество (TDS)</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {parsedData.map((item, index) => {
                        // Пропуск строки для геодатчика, если сообщение содержит "служебный пакет"
                        if (isGround && item.uplink?.object?.message === "служебный пакет") {
                            return null;
                        }

                        return (
                            <tr key={index}>
                                <td>{new Date(isMeteo ? item.time : item.time).toLocaleString().slice(0, -3)}</td>
                                {isMeteo ? (
                                    <>
                                        <td>{item.temperature}</td>
                                        <td>{item.humidity}</td>
                                        <td>{item.pressure}</td>
                                        <td>{item.rainfall}</td>
                                        <td>{item.batteryVoltage}</td>
                                    </>
                                ) : (
                                    <>
                                        <td>{item.uplink?.object?.temperature || "-"}</td>
                                        <td>{item.uplink?.object?.humidity || "-"}</td>
                                        <td>{item.uplink?.object?.conductivity || "-"}</td>
                                        <td>{item.uplink?.object?.nitrogen || "-"}</td>
                                        <td>{item.uplink?.object?.ph || "-"}</td>
                                        <td>{item.uplink?.object?.phosphorus || "-"}</td>
                                        <td>{item.uplink?.object?.potassium || "-"}</td>
                                        <td>{item.uplink?.object?.salt_saturation || "-"}</td>
                                        <td>{item.uplink?.object?.tds || "-"}</td>
                                    </>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        </div>
        
    );
}
