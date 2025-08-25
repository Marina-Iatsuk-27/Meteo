// src/context/GetDeviceHistory.jsx
import React, { createContext, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import GETHISTORY, { toIsoSecond } from "../Services/GETHISTORY";
import Loader from "../components/Loader/Loader";

export const DeviceHistoryContext = createContext();

function GetDeviceHistory({ children }) {
  const { id } = useParams();

  // null -> пока не загружено (Loader)
  const [deviceHistory, setDeviceHistory] = useState(null);
  const [loading, setLoading] = useState(false);

  // filters: from/to ISO (до секунд) или null. limit управляет серверным лимитом.
  const [filters, setFilters] = useState({
    from: null,
    to: null,
    limit: null,
  });

  const getDeviceServer = useCallback(async (deviceId, opts = {}) => {
    try {
      setLoading(true);
      const data = await GETHISTORY.getDevice(deviceId, opts);
      setDeviceHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Ошибка при загрузке данных:", e);
      setDeviceHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Авто-загрузка при смене id или фильтров
  useEffect(() => {
    if (!id) return;

    // если нет фильтра from/to — загрузить последние 50 (серверный limit)
    if (!filters.from && !filters.to) {
      getDeviceServer(id, { limit: filters.limit || 50 });
    } else {
      // при наличии диапазона — запрашиваем побольше
      getDeviceServer(id, { from: filters.from, to: filters.to, limit: filters.limit || 5000 });
    }
  }, [id, filters, getDeviceServer]);

  // пресеты периода
  const setPeriod = useCallback((preset) => {
    const now = new Date();

    if (preset === "last50") {
      setFilters({ from: null, to: null, limit: 50 });
      return;
    }

    if (preset === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 0);
      setFilters({ from: toIsoSecond(start), to: toIsoSecond(end), limit: 5000 });
      return;
    }

    let from;
    if (preset === "24h") {
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    } else if (preset === "7d") {
      from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (preset === "30d") {
      from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      from = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }

    setFilters({ from: toIsoSecond(from), to: toIsoSecond(now), limit: 5000 });
  }, []);

  // кастомный диапазон: from/to могут быть Date или строкой 'YYYY-MM-DD' (тогда берем весь день локально)
  const setCustomRange = useCallback((fromVal, toVal) => {
    const parse = (v, isEnd = false) => {
      if (!v) return null;
      // строка YYYY-MM-DD => локальный день
      if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v)) {
        const d = new Date(v); // midnight локально
        if (isEnd) d.setHours(23, 59, 59, 0);
        return toIsoSecond(d);
      }
      const d = typeof v === "string" ? new Date(v) : v;
      if (isNaN(d.getTime())) return null;
      if (isEnd) d.setMilliseconds(0); // keep seconds precision
      return toIsoSecond(d);
    };

    const cleanFrom = parse(fromVal, false);
    const cleanTo = parse(toVal, true);

    setFilters({ from: cleanFrom, to: cleanTo, limit: 5000 });
  }, []);

  const refresh = useCallback(() => {
    if (!id) return;
    if (!filters.from && !filters.to) {
      getDeviceServer(id, { limit: filters.limit || 50 });
    } else {
      getDeviceServer(id, { from: filters.from, to: filters.to, limit: filters.limit || 5000 });
    }
  }, [id, filters, getDeviceServer]);

  const value = {
    deviceHistory,
    loading,
    filters,
    setFilters,
    setPeriod,
    setCustomRange,
    refresh,
  };

  // пока не загружено — показываем Loader (как у тебя раньше было)
  if (deviceHistory === null) {
    return <Loader text="Загружаем историю устройства..." />;
  }

  return <DeviceHistoryContext.Provider value={value}>{children}</DeviceHistoryContext.Provider>;
}

export default GetDeviceHistory;
