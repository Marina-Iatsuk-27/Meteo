import React, { useContext, useMemo } from "react";
import style from "./DeviceInfo.module.scss";
import Dashboard from "../Dashboard/Dashboard";
import { DeviceHistoryContext } from "../../context/GetDeviceHistory";

// Проверка, что значение пустое (null, undefined, пустая строка, или строка 'null'/'undefined')
const isEmptyValue = (value) =>
  value === undefined ||
  value === null ||
  value === "" ||
  value === "undefined" ||
  value === "null";

// Парсинг поля raw_data и возврат вложенного объекта object
const parseRawDataObject = (historyEntry) => {
  if (!historyEntry?.raw_data) return {};
  try {
    const parsedJson = JSON.parse(historyEntry.raw_data);
    return parsedJson?.object || {};
  } catch {
    return {};
  }
};

// Получение значения по ключу: сначала из верхнего уровня, потом из raw_data.object
const getValueFromHistoryEntry = (historyEntry, key) => {
  if (!historyEntry) return null;

  const valueFromTopLevel = historyEntry[key];
  if (!isEmptyValue(valueFromTopLevel)) return valueFromTopLevel;

  const objectFromRawData = parseRawDataObject(historyEntry);
  const valueFromObject = objectFromRawData?.[key];
  return isEmptyValue(valueFromObject) ? null : valueFromObject;
};

// Объединение последних N записей для метеостанции
const mergeRecentMeteoReadings = (historyEntries = [], numberOfPackets = 3) => {
  const sortedHistory = [...historyEntries].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );
  const recentPackets = sortedHistory.slice(0, numberOfPackets);

  const meteoKeys = [
    "temperature",
    "humidity",
    "pressure",
    "rainfall",
    "batteryVoltage",
    "windSpeed",
    "windDirection",
    "uvIndex",
    "wetTemperature",
    "windSpeedAvg",
    "windSpeedMin",
    "windSpeedMax"
  ];

  const resultData = {};
  meteoKeys.forEach((key) => {
    for (const entry of recentPackets) {
      const value = getValueFromHistoryEntry(entry, key);
      if (!isEmptyValue(value)) {
        resultData[key] = value;
        break;
      }
    }
    if (resultData[key] === undefined) {
      resultData[key] = null;
    }
  });

  return resultData;
};

// Получение последней валидной записи для геодатчика
const pickLatestGroundReading = (historyEntries = []) => {
  const sortedHistory = [...historyEntries].sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  const groundKeys = [
    "temperature",
    "humidity",
    "ph",
    "conductivity",
    "nitrogen",
    "phosphorus",
    "potassium",
    "salt_saturation",
    "tds"
  ];

  for (const entry of sortedHistory) {
    const hasValidData = groundKeys.some((key) => {
      const value = getValueFromHistoryEntry(entry, key);
      return !isEmptyValue(value);
    });
    if (hasValidData) {
      return entry;
    }
  }
  return null;
};

// Форматирование времени в человекочитаемый вид
const formatDateTime = (isoString) => {
  if (!isoString) return "";
  try {
    return new Date(isoString).toLocaleString();
  } catch {
    return isoString;
  }
};

export default function DeviceInfo() {
  const { deviceHistory = [] } = useContext(DeviceHistoryContext);

  const deviceData = useMemo(() => {
    if (!Array.isArray(deviceHistory) || deviceHistory.length === 0) return null;

    const sortedHistory = [...deviceHistory].sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );
    const latestEntry = sortedHistory[0];

    let deviceInfo = {};
    for (const entry of sortedHistory) {
      if (entry?.raw_data) {
        try {
          const parsedJson = JSON.parse(entry.raw_data);
          if (parsedJson?.deviceInfo) {
            deviceInfo = parsedJson.deviceInfo;
            break;
          }
        } catch {}
      }
    }

    const deviceName =
      latestEntry?.deviceName || deviceInfo?.deviceName || "";
    const isMeteoDevice = String(deviceName).toLowerCase().includes("meteo");
    const isGroundDevice = String(deviceName).toLowerCase().includes("ground");

    let readingsObject = {};
    if (isMeteoDevice) {
      readingsObject = mergeRecentMeteoReadings(sortedHistory, 3);
    } else if (isGroundDevice) {
      const latestGroundPacket = pickLatestGroundReading(sortedHistory);
      if (latestGroundPacket) {
        const groundKeys = [
          "temperature",
          "humidity",
          "ph",
          "conductivity",
          "nitrogen",
          "phosphorus",
          "potassium",
          "salt_saturation",
          "tds"
        ];
        groundKeys.forEach((key) => {
          readingsObject[key] = getValueFromHistoryEntry(
            latestGroundPacket,
            key
          );
        });
      } else {
        readingsObject = {
          temperature: null,
          humidity: null,
          ph: null,
          conductivity: null,
          nitrogen: null,
          phosphorus: null,
          potassium: null,
          salt_saturation: null,
          tds: null
        };
      }
    } else {
      readingsObject = parseRawDataObject(latestEntry);
    }

    return {
      state: {
        time: latestEntry?.time || null,
        uplink: {
          deviceInfo: {
            deviceName:
              deviceInfo?.deviceName ?? latestEntry?.deviceName ?? "",
            devEui: deviceInfo?.devEui ?? latestEntry?.devEui ?? "",
            deviceClassEnabled:
              deviceInfo?.deviceClassEnabled ?? "",
            deviceProfileName:
              deviceInfo?.deviceProfileName ?? ""
          },
          object: readingsObject
        }
      }
    };
  }, [deviceHistory]);

  const deviceNameFromData =
    deviceData?.state?.uplink?.deviceInfo?.deviceName || "";
  const isMeteoDevice = String(deviceNameFromData)
    .toLowerCase()
    .includes("meteo");
  const isGroundDevice = String(deviceNameFromData)
    .toLowerCase()
    .includes("ground");

  if (!deviceData) {
    return (
      <div className={style.deviceInfoContainer}>
        <h1 className={style.title}>Нет данных по устройству</h1>
      </div>
    );
  }

  const readings = deviceData.state.uplink.object || {};
  const info = deviceData.state.uplink.deviceInfo || {};

  return (
    <div className={style.deviceInfoContainer}>
      <h1 className={style.title}>
        {isMeteoDevice && "Данные метеостанции"}
        {isGroundDevice && "Данные геодатчика"}
        {!isMeteoDevice && !isGroundDevice && "Данные"}
      </h1>

      <div className={style.dataContainer}>
        <div className={style.section}>
          <h2>
            {isMeteoDevice && "Информация об устройстве метеостанции"}
            {isGroundDevice && "Информация об устройстве геодатчика"}
            {!isMeteoDevice && !isGroundDevice && "Информация об устройстве"}
          </h2>
          <p>
            <strong className={style.customStrong}>Имя устройства:</strong>{" "}
            {info.deviceName || "-"}
          </p>
          <p>
            <strong className={style.customStrong}>ID устройства (devEUI):</strong>{" "}
            {info.devEui || "-"}
          </p>
          <p>
            <strong className={style.customStrong}>Класс устройства:</strong>{" "}
            {info.deviceClassEnabled || "-"}
          </p>
          <p>
            <strong className={style.customStrong}>Профиль устройства:</strong>{" "}
            {info.deviceProfileName || "-"}
          </p>
        </div>

        <Dashboard
          deviceData={deviceData}
          isMeteo={isMeteoDevice}
          isGround={isGroundDevice}
        />

        <div className={style.section}>
          <h2>
            {isMeteoDevice
              ? "Показания метеостанции"
              : "Показания геодатчика"}
          </h2>

          {isMeteoDevice ? (
            <>
              <p><strong className={style.customStrong}>Напряжение батареи:</strong> {readings.batteryVoltage ?? "–"} В</p>
              <p><strong className={style.customStrong}>Минимальная скорость ветра:</strong> {readings.windSpeedMin ?? "–"} м/с</p>
              <p><strong className={style.customStrong}>Максимальное направление ветра:</strong> {readings.windDirectionMax ?? "–"}°</p>
              <p><strong className={style.customStrong}>Температура датчика:</strong> {readings.wetTemperature ?? "–"} °C</p>
              <p><strong className={style.customStrong}>Температура воздуха:</strong> {readings.temperature ?? "–"} °C</p>
              <p><strong className={style.customStrong}>Среднее направление ветра:</strong> {readings.windDirectionAvg ?? "–"}°</p>
              <p><strong className={style.customStrong}>Влажность:</strong> {readings.humidity ?? "–"} %</p>
              <p><strong className={style.customStrong}>Давление:</strong> {readings.pressure ?? "–"} мм рт. ст.</p>
              <p><strong className={style.customStrong}>Осадки:</strong> {readings.rainfall ?? "–"} мм</p>
              <p><strong className={style.customStrong}>Средняя скорость ветра:</strong> {readings.windSpeedAvg ?? "–"} м/с</p>
            </>
          ) : (
            <>
              <p><strong className={style.customStrong}>Влажность:</strong> {readings.humidity ?? "–"} %</p>
              <p><strong className={style.customStrong}>Температура:</strong> {readings.temperature ?? "–"} °C</p>
              <p><strong className={style.customStrong}>Проводимость:</strong> {readings.conductivity ?? "–"} мкСм/см</p>
              <p><strong className={style.customStrong}>Содержание азота:</strong> {readings.nitrogen ?? "–"} мг/л</p>
              <p><strong className={style.customStrong}>pH:</strong> {readings.ph ?? "–"}</p>
              <p><strong className={style.customStrong}>Содержание фосфора:</strong> {readings.phosphorus ?? "–"} мг/л</p>
              <p><strong className={style.customStrong}>Содержание калия:</strong> {readings.potassium ?? "–"} мг/л</p>
              <p><strong className={style.customStrong}>Насыщение солью:</strong> {readings.salt_saturation ?? "–"} %</p>
              <p><strong className={style.customStrong}>TDS:</strong> {readings.tds ?? "–"} мг/л</p>
            </>
          )}
        </div>

        <div className={style.section}>
          <h2>Время показаний</h2>
          <p>{formatDateTime(deviceData.state.time)}</p>
        </div>
      </div>
    </div>
  );
}
