function decodeUplink(input) {
    const asciiData = bytesToCleanAscii(input.bytes);
    return { data: extractSensorData(asciiData) };
}

/**
 * Convert a byte array to a cleaned ASCII string
 * @param {Uint8Array} bytes - The byte array to convert
 * @returns {string} - Clean ASCII string
 */
function bytesToCleanAscii(bytes) {
    // Преобразуем байты в строку
    let rawAscii = bytes.map(byte => String.fromCharCode(byte)).join('');
    // Удаляем нечитабельные символы (например, управляющие символы)
    return rawAscii.replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Extract sensor data from ASCII string using regex patterns
 * @param {string} asciiData - Clean ASCII string
 * @returns {object} - Parsed sensor data
 */
function extractSensorData(asciiData) {
    function extractData(regex, data, defaultValue = null) {
        const match = data.match(regex);
        return match ? match[1] : defaultValue;
    }

    const windDirectionAvg = extractData(/Dn=(\d+\.?\d*)#/, asciiData, "undefined");
    const windDirectionMax = extractData(/Dm=(\d+\.?\d*)#/, asciiData, "undefined");
    const windSpeedMin = extractData(/Sn=(\d+\.?\d*)#/, asciiData, "undefined");
    const windSpeedMax = extractData(/Sx=(\d+\.?\d*)#/, asciiData, "undefined");
    const windSpeedAvg = extractData(/Sm=(\d+\.?\d*)#/, asciiData, "undefined");
    const temperature = extractData(/Ta=(\d+\.?\d*)C/, asciiData, "undefined");
    const humidity = extractData(/Ua=(\d+\.?\d*)P/, asciiData, "undefined");
    //const pressure = extractData(/Pa=(\d+\.?\d*)H?/, asciiData, "undefined"); 
    // --- Давление: гПа -> мм рт. ст. ---
    const pressureRaw = extractData(/Pa=(\d+(?:\.\d+)?)(?:H|#)?/, asciiData, "undefined");
    const pressure = pressureRaw !== "undefined"
        ? (parseFloat(pressureRaw) * 0.75006375541921).toFixed(1)
        : "undefined";
    const rainfall = extractData(/Rc=(\d+\.?\d*)M/, asciiData, "undefined");
    const wetTemperature = extractData(/Th=(\d+\.?\d*)C/, asciiData, "undefined");
    const batteryVoltage = extractData(/Vh=(\d+\.?\d*)N/, asciiData, "undefined");

    return {
        windDirectionAvg,
        windDirectionMax,
        windSpeedMin,
        windSpeedMax,
        windSpeedAvg,
        temperature,
        humidity,
        pressure,
        rainfall,
        wetTemperature,
        batteryVoltage
    };
}






//Учет ветра:
function decodeUplink(input) {
    const asciiData = bytesToCleanAscii(input.bytes);
    return { data: extractSensorData(asciiData) };
}

/**
 * Convert a byte array to a cleaned ASCII string
 * @param {Uint8Array} bytes - The byte array to convert
 * @returns {string} - Clean ASCII string
 */
function bytesToCleanAscii(bytes) {
    let rawAscii = bytes.map(byte => String.fromCharCode(byte)).join('');
    return rawAscii.replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Extract sensor data from ASCII string using regex patterns
 * @param {string} asciiData - Clean ASCII string
 * @returns {object} - Parsed sensor data
 */
function extractSensorData(asciiData) {
    function extractData(regex, data, defaultValue = null) {
        const match = data.match(regex);
        return match ? match[1] : defaultValue;
    }

    // --- Ветер: направления ---
    const windDirectionAvg = extractData(/Dn=(\d+(?:\.\d+)?)(?:D|#)?/, asciiData, "undefined");
    const windDirectionMax = extractData(/Dm=(\d+(?:\.\d+)?)(?:D|#)?/, asciiData, "undefined");
    const windDirectionExtreme = extractData(/Dx=(\d+(?:\.\d+)?)(?:D|#)?/, asciiData, "undefined");

    // --- Ветер: скорости ---
    const windSpeedMin = extractData(/Sn=(\d+(?:\.\d+)?)(?:K|#)?/, asciiData, "undefined");
    const windSpeedAvg = extractData(/Sm=(\d+(?:\.\d+)?)(?:K|#)?/, asciiData, "undefined");
    const windSpeedMax = extractData(/Sx=(\d+(?:\.\d+)?)(?:K|#)?/, asciiData, "undefined");

    // --- Погода ---
    const temperature = extractData(/Ta=(\d+(?:\.\d+)?)C/, asciiData, "undefined");
    const humidity = extractData(/Ua=(\d+(?:\.\d+)?)P/, asciiData, "undefined");

    // --- Давление: гПа -> мм рт. ст. ---
    const pressureRaw = extractData(/Pa=(\d+(?:\.\d+)?)(?:H|#)?/, asciiData, "undefined");
    const pressure = pressureRaw !== "undefined"
        ? (parseFloat(pressureRaw) * 0.75006375541921).toFixed(1)
        : "undefined";

    // --- Осадки, температура почвы, батарея ---
    const rainfall = extractData(/Rc=(\d+(?:\.\d+)?)M/, asciiData, "undefined");
    const wetTemperature = extractData(/Th=(\d+(?:\.\d+)?)C/, asciiData, "undefined");
    const batteryVoltage = extractData(/Vh=(\d+(?:\.\d+)?)N/, asciiData, "undefined");

    return {
        windDirectionAvg,
        windDirectionMax,
        windDirectionExtreme,
        windSpeedMin,
        windSpeedAvg,
        windSpeedMax,
        temperature,
        humidity,
        pressure,   // мм рт. ст.
        rainfall,
        wetTemperature,
        batteryVoltage
    };
}









//НЕ ТЕСТИРОВАНО (должен собирать пакет воедино)
function decodeUplink(input) {
    const asciiData = bytesToCleanAscii(input.bytes);

    // --- Буферизация пакетов ---
    if (!decodeUplink.buffer) decodeUplink.buffer = "";
    decodeUplink.buffer += asciiData;

    // Проверяем, завершился ли пакет (обычно \r\n в конце)
    if (/\r?\n$/.test(decodeUplink.buffer)) {
        const fullData = decodeUplink.buffer;
        decodeUplink.buffer = ""; // очищаем на будущее

        return { data: extractSensorData(fullData) };
    }

    // Если пакет ещё не полный, возвращаем промежуточные данные
    return { data: { partial: true, raw: asciiData } };
}

/**
 * Конвертация байтов в ASCII строку и очистка от мусора
 */
function bytesToCleanAscii(bytes) {
    let rawAscii = bytes.map(b => String.fromCharCode(b)).join('');
    return rawAscii.replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Парсер показаний метеостанции
 */
function extractSensorData(asciiData) {
    function extractData(regex, data, defaultValue = null) {
        const match = data.match(regex);
        return match ? match[1] : defaultValue;
    }

    return {
        windDirectionAvg: extractData(/Dn=(\d+(?:\.\d+)?)#/, asciiData),
        windDirectionMax: extractData(/Dm=(\d+(?:\.\d+)?)#/, asciiData),
        windDirectionExtreme: extractData(/Dx=(\d+(?:\.\d+)?)#/, asciiData),
        windSpeedMin: extractData(/Sn=(\d+(?:\.\d+)?)#/, asciiData),
        windSpeedAvg: extractData(/Sm=(\d+(?:\.\d+)?)#/, asciiData),
        windSpeedMax: extractData(/Sx=(\d+(?:\.\d+)?)#/, asciiData),
        temperature: extractData(/Ta=(\d+(?:\.\d+)?)C/, asciiData),
        humidity: extractData(/Ua=(\d+(?:\.\d+)?)P/, asciiData),
        pressure: extractData(/Pa=(\d+(?:\.\d+)?)(?:H|#)?/, asciiData),
        rainfall: extractData(/Rc=(\d+(?:\.\d+)?)M/, asciiData),
        wetTemperature: extractData(/Th=(\d+(?:\.\d+)?)C/, asciiData),
        batteryVoltage: extractData(/Vh=(\d+(?:\.\d+)?)N/, asciiData)
    };
}
