// Dashboard.js
import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";
import styles from "./Dashboard.module.scss";

/* ---------- Helpers ---------- */

// считать пустым любое: undefined, null, '', 'undefined', 'null'
const isEmptyValue = (v) =>
  v === undefined ||
  v === null ||
  v === "" ||
  v === "undefined" ||
  v === "null";

// безопасно привести к числу или вернуть null
const toNumberOrNull = (v) => {
  if (isEmptyValue(v)) return null;
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : null;
};

// печатать число с суффиксом или "–"
const formatOrDash = (num, suffix = "") =>
  num === null || num === undefined ? "–" : `${num}${suffix}`;

// из пакета/записи сначала берем top-level, если там пусто — смотрим raw_data.object[key]
const pickValueFromPacket = (packet = {}, key) => {
  if (!packet) return null;
  const top = packet[key];
  if (!isEmptyValue(top)) return top;

  if (packet.raw_data) {
    try {
      const parsed = JSON.parse(packet.raw_data);
      const obj = parsed?.object || {};
      const val = obj?.[key];
      if (!isEmptyValue(val)) return val;
    } catch {
      // ignore parse errors
    }
  }
  return null;
};

//Если deviceData — массив истории, объединяем последние N для meteo (берём первые ненулевые по ключу)
const mergeLastNForMeteo = (history = [], n = 3) => {
  const sorted = [...history].sort((a, b) => new Date(b.time) - new Date(a.time));
  const last = sorted.slice(0, n);
  const keys = [
    "temperature",
    "humidity",
    "pressure",
    "rainfall",
    "batteryVoltage",
    "windSpeed",
    "windSpeedAvg",
    "windSpeedMin",
    "windSpeedMax",
    "windDirection",
    "uvIndex",
    "wetTemperature"
  ];
  const result = {};
  keys.forEach((k) => {
    result[k] = null;
    for (const pkt of last) {
      const v = pickValueFromPacket(pkt, k);
      if (!isEmptyValue(v)) {
        result[k] = v;
        break;
      }
    }
  });
  return result;
};

// Если deviceData — массив истории, ищем последний пакет с хоть какой-то ground-метрикой
const pickLatestGroundPacket = (history = []) => {
  const sorted = [...history].sort((a, b) => new Date(b.time) - new Date(a.time));
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
  for (const pkt of sorted) {
    const ok = groundKeys.some((k) => !isEmptyValue(pickValueFromPacket(pkt, k)));
    if (ok) return pkt;
  }
  return null;
};

// направление ветра в текстовую метку
const getWindDirectionText = (angle) => {
  if (angle === null || angle === undefined) return "–";
  const a = ((Number(angle) % 360) + 360) % 360; // 0..359
  if (a >= 0 && a <= 22 || a > 337) return "С";
  if (a > 22 && a <= 67) return "СВ";
  if (a > 67 && a <= 112) return "В";
  if (a > 112 && a <= 157) return "ЮВ";
  if (a > 157 && a <= 202) return "Ю";
  if (a > 202 && a <= 247) return "ЮЗ";
  if (a > 247 && a <= 292) return "З";
  if (a > 292 && a <= 337) return "СЗ";
  return "–";
};

/* ---------- Цвета / Статусы (защита от null) ---------- */
const neutralColor = "#9fa786";

const getAirHumidityColor = (val) => {
  if (val === null) return neutralColor;
  if (val < 30) return "#889069";
  if (val >= 30 && val < 60) return "#606c38";
  return "#d1603d";
};
const getAirTemperatureColor = (val) => {
  if (val === null) return neutralColor;
  if (val < 15) return "#5e7ce2";
  if (val >= 15 && val <= 25) return "#606c38";
  return "#d1603d";
};
const getAirPressureColor = (val) => {
  if (val === null) return neutralColor;
  if (val < 740) return "#5e7ce2";
  if (val >= 740 && val <= 779) return "#606c38";
  return "#d1603d";
};
const getGroundTemperatureColor = (val) => {
  if (val === null) return neutralColor;
  if (val < 16) return "#5e7ce2";
  if (val >= 16 && val <= 22) return "#606c38";
  return "#d1603d";
};
const getGroundHumidityColor = (val) => {
  if (val === null) return neutralColor;
  if (val < 10) return "#5e7ce2";
  if (val >= 10 && val <= 40) return "#606c38";
  return "#d1603d";
};
const getGroundConductivityColor = (val) => {
  if (val === null) return neutralColor;
  if (val < 200) return "#5e7ce2";
  if (val >= 200 && val <= 1200) return "#606c38";
  return "#d1603d";
};
const getGroundPHColor = (val) => {
  if (val === null) return neutralColor;
  if (val < 5) return "#5e7ce2";
  if (val >= 5 && val <= 8) return "#606c38";
  return "#d1603d";
};

/* ---------- Компонент ---------- */

const Dashboard = ({ deviceData, isMeteo, isGround }) => {
  // deviceData может быть либо объектом (state.uplink.object), либо массивом истории.
  if (!deviceData) return null;

  // 1) Получаем объект показаний (readings)
  let readings = null;

  // если deviceData — объект в старом формате (state.uplink.object)
  if (deviceData?.state?.uplink?.object) {
    readings = deviceData.state.uplink.object;
  } else if (Array.isArray(deviceData)) {
    // если массив — попробуем собрать
    const history = deviceData;
    // определим тип устройства по имени в истории
    const firstPacket = history.find(Boolean) || {};
    const deviceName = firstPacket.deviceName || (firstPacket.raw_data ? (() => {
      try { return JSON.parse(firstPacket.raw_data)?.deviceInfo?.deviceName; } catch { return ""; }
    })() : "");
    const isMeteoFromHistory = String(deviceName).toLowerCase().includes("meteo");
    const isGroundFromHistory = String(deviceName).toLowerCase().includes("ground");

    if (isMeteoFromHistory) {
      readings = mergeLastNForMeteo(history, 3);
    } else if (isGroundFromHistory) {
      const latestGround = pickLatestGroundPacket(history);
      if (latestGround) {
        const keys = [
          "temperature", "humidity", "ph", "conductivity",
          "nitrogen", "phosphorus", "potassium", "salt_saturation", "tds"
        ];
        readings = {};
        keys.forEach((k) => readings[k] = pickValueFromPacket(latestGround, k));
      } else {
        readings = {}; // пустышка
      }
    } else {
      // дефолт — взять object из первого пакета, если есть
      readings = pickValueFromPacket(firstPacket, "object") || {};
    }
  } else {
    // если неизвестный формат — попытка взять поле object
    readings = deviceData.object || {};
  }

  // защитимся: readings будет объектом
  readings = readings || {};

  /* --- метрики (приводим к числам где нужно) --- */
  // Метео
  const temperature = toNumberOrNull(readings.temperature ?? readings.wetTemperature ?? null);
  const humidity = toNumberOrNull(readings.humidity ?? null);
  const pressure = toNumberOrNull(readings.pressure ?? null); // часто hPa
  const rainfall = toNumberOrNull(readings.rainfall ?? null);
  const batteryVoltage = toNumberOrNull(readings.batteryVoltage ?? null);
  const windSpeedAvg = toNumberOrNull(readings.windSpeedAvg ?? readings.windSpeed ?? null);
  const windSpeedMin = toNumberOrNull(readings.windSpeedMin ?? null);
  const windSpeedMax = toNumberOrNull(readings.windSpeedMax ?? null);
  const windDirectionDeg = toNumberOrNull(readings.windDirection ?? null);
  const uvIndex = toNumberOrNull(readings.uvIndex ?? null);
  const wetTemperature = toNumberOrNull(readings.wetTemperature ?? null);

  // Гео
  const groundTemperature = toNumberOrNull(readings.temperature ?? null);
  const groundHumidity = toNumberOrNull(readings.humidity ?? null);
  const conductivity = toNumberOrNull(readings.conductivity ?? null);
  const nitrogen = toNumberOrNull(readings.nitrogen ?? null);
  const phosphorus = toNumberOrNull(readings.phosphorus ?? null);
  const potassium = toNumberOrNull(readings.potassium ?? null);
  const ph = toNumberOrNull(readings.ph ?? null);
  const saltSaturation = toNumberOrNull(readings.salt_saturation ?? null);
  const tds = toNumberOrNull(readings.tds ?? null);

  /* --- UI для метео --- */
  if (isMeteo) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.dataSection}>

          {/* Влажность воздуха */}
          <div className={styles.gaugeContainer}>
            <h3>Влажность воздуха</h3>
            <RadialBarChart
              width={140}
              height={140}
              cx="50%"
              cy="50%"
              innerRadius="68%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              data={[{ value: humidity ?? 0 }]}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar minAngle={15} background clockWise dataKey="value" fill={getAirHumidityColor(humidity)} />
            </RadialBarChart>
            <div className={styles.label}>{formatOrDash(humidity, "%")}</div>
            <div className={styles.status} style={{ color: getAirHumidityColor(humidity) }}>
              {humidity === null ? "Нет данных" : (humidity < 30 ? "Низкая" : (humidity < 60 ? "Норма" : "Высокая"))}
            </div>
          </div>

          {/* Температура воздуха */}
          <div className={styles.gaugeContainer}>
            <h3>Температура воздуха</h3>
            <RadialBarChart
              width={140}
              height={140}
              cx="50%"
              cy="50%"
              innerRadius="68%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              data={[{ value: temperature ?? 0 }]}
            >
              <PolarAngleAxis type="number" domain={[ -20, 50]} angleAxisId={0} tick={false} />
              <RadialBar minAngle={15} background clockWise dataKey="value" fill={getAirTemperatureColor(temperature)} />
            </RadialBarChart>
            <div className={styles.label}>{formatOrDash(temperature, "°C")}</div>
            <div className={styles.status} style={{ color: getAirTemperatureColor(temperature) }}>
              {temperature === null ? "Нет данных" : (temperature < 15 ? "Холодно" : (temperature <= 25 ? "Норма" : "Жарко"))}
            </div>
          </div>

          {/* Атмосферное давление */}
          <div className={styles.gaugeContainer}>
            <h3>Атмосферное давление</h3>
            <div className={styles.pressureValue} style={{ color: getAirPressureColor(pressure) }}>
              {formatOrDash(pressure, " мм рт. ст.")}
            </div>
            <div className={styles.status} style={{ color: getAirPressureColor(pressure) }}>
              {pressure === null ? "Нет данных" : (pressure < 740 ? "Низкое" : (pressure <= 779 ? "Норма" : "Высокое"))}
            </div>
          </div>

          {/* Осадки */}
          <div className={styles.gaugeContainer}>
            <h3>Осадки</h3>
            <div className={styles.rainfall}>{formatOrDash(rainfall, " мм")}</div>
          </div>

          {/* Батарея */}
          <div className={styles.gaugeContainer}>
            <h3>Напряжение батареи</h3>
            <div className={styles.value}>{formatOrDash(batteryVoltage, " В")}</div>
          </div>

          {/* Температура датчика */}
          <div className={styles.gaugeContainer}>
            <h3>Температура датчика</h3>
            <div className={styles.value}>{formatOrDash(wetTemperature, "°C")}</div>
          </div>

          {/* Скорости ветра */}
          <div className={styles.gaugeContainer}>
            <h3>Скорость ветра (сред./мин./макс.)</h3>
            <div className={styles.value}>
              {formatOrDash(windSpeedAvg, " м/с")} / {formatOrDash(windSpeedMin, " м/с")} / {formatOrDash(windSpeedMax, " м/с")}
            </div>
          </div>

          {/* Направление ветра */}
          <div className={styles.gaugeContainer}>
            <h3>Направление ветра</h3>
            <div className={styles.value}>
              {windDirectionDeg === null ? "–" : `${windDirectionDeg}°`} ({getWindDirectionText(windDirectionDeg)})
            </div>
          </div>

          {/* UV индекс */}
          <div className={styles.gaugeContainer}>
            <h3>UV-индекс</h3>
            <div className={styles.value}>{formatOrDash(uvIndex)}</div>
          </div>

        </div>
      </div>
    );
  }

  /* --- UI для геодатчика --- */
  if (isGround) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.dataSection}>
          <div className={styles.gaugeContainer}>
            <h3>Температура почвы</h3>
            <RadialBarChart
              width={140}
              height={140}
              cx="50%"
              cy="50%"
              innerRadius="68%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              data={[{ value: groundTemperature ?? 0 }]}
            >
              <PolarAngleAxis type="number" domain={[ -10, 50]} angleAxisId={0} tick={false} />
              <RadialBar minAngle={15} background clockWise dataKey="value" fill={getGroundTemperatureColor(groundTemperature)} />
            </RadialBarChart>
            <div className={styles.label}>{formatOrDash(groundTemperature, "°C")}</div>
            <div className={styles.status} style={{ color: getGroundTemperatureColor(groundTemperature) }}>
              {groundTemperature === null ? "Нет данных" : (groundTemperature < 16 ? "Холодно" : (groundTemperature <= 22 ? "Норма" : "Жарко"))}
            </div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Влажность почвы</h3>
            <RadialBarChart
              width={140}
              height={140}
              cx="50%"
              cy="50%"
              innerRadius="68%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              data={[{ value: groundHumidity ?? 0 }]}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar minAngle={15} background clockWise dataKey="value" fill={getGroundHumidityColor(groundHumidity)} />
            </RadialBarChart>
            <div className={styles.label}>{formatOrDash(groundHumidity, "%")}</div>
            <div className={styles.status} style={{ color: getGroundHumidityColor(groundHumidity) }}>
              {groundHumidity === null ? "Нет данных" : (groundHumidity < 10 ? "Сухо" : (groundHumidity <= 40 ? "Норма" : "Влажно"))}
            </div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Проводимость (EC)</h3>
            <div className={styles.value} style={{ color: getGroundConductivityColor(conductivity) }}>
              {formatOrDash(conductivity, " мкСм/см")}
            </div>
            <div className={styles.status} style={{ color: getGroundConductivityColor(conductivity) }}>
              {conductivity === null ? "Нет данных" : (conductivity < 200 ? "Низкая" : (conductivity <= 1200 ? "Норма" : "Высокая"))}
            </div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Азот (N)</h3>
            <div className={styles.value}>{formatOrDash(nitrogen, " мг/л")}</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Фосфор (P)</h3>
            <div className={styles.value}>{formatOrDash(phosphorus, " мг/л")}</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Калий (K)</h3>
            <div className={styles.value}>{formatOrDash(potassium, " мг/л")}</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>pH</h3>
            <RadialBarChart
              width={140}
              height={140}
              cx="50%"
              cy="50%"
              innerRadius="68%"
              outerRadius="100%"
              startAngle={180}
              endAngle={0}
              data={[{ value: (ph !== null ? ph * 10 : 0) }]}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar minAngle={15} background clockWise dataKey="value" fill={getGroundPHColor(ph)} />
            </RadialBarChart>
            <div className={styles.label}>{formatOrDash(ph)}</div>
            <div className={styles.status} style={{ color: getGroundPHColor(ph) }}>
              {ph === null ? "Нет данных" : (ph < 5 ? "Кислая" : (ph <= 8 ? "Норма" : "Щелочная"))}
            </div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>Насыщенность солей</h3>
            <div className={styles.value}>{formatOrDash(saltSaturation, " %")}</div>
          </div>

          <div className={styles.gaugeContainer}>
            <h3>TDS</h3>
            <div className={styles.value}>{formatOrDash(tds, " мг/л")}</div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
