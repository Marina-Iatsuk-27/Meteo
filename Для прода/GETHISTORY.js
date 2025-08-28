// src/Services/GETHISTORY.js
/** helper: ISO до секунд (удаляем миллисекунды) */
function toIsoSecond(d) {
  if (!d) return d;
  const dt = (typeof d === "string") ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toISOString().replace(/\.\d{3}Z$/, "Z");
}

class GETHISTORY {
  /**
   * id - devEui
   * options: { from, to, limit }
   * from/to могут быть ISO строки или Date
   */
  static async getDevice(id, { from, to, limit } = {}) {
    try {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit);
      if (from) params.append("from", toIsoSecond(from));
      if (to) params.append("to", toIsoSecond(to));

      const qs = params.toString();
      const url = `/api/data/${encodeURIComponent(id)}${qs ? `?${qs}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("GETHISTORY error:", error);
      return false;
    }
  }
}

export default GETHISTORY;
export { toIsoSecond };
