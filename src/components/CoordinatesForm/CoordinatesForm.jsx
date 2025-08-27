import React, { useState } from "react";
import styles from "./CoordinatesForm.module.scss";

export default function CoordinatesForm({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData 
}) {
  const [latitude, setLatitude] = useState(initialData?.latitude || "");
  const [longitude, setLongitude] = useState(initialData?.longitude || "");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!latitude || !longitude) return alert("Заполните обе координаты!");
    onSave({
      devEui: initialData.devEui,
      deviceName: initialData.deviceName,
      latitude,
      longitude,
      mode: initialData.mode,
    });
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>
          {initialData.mode === "add" ? "Добавить датчик" : "Задать координаты"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Широта</label>
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Долгота</label>
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
          </div>
          <div className={styles.actions}>
            <button type="submit" className={styles.saveBtn}>
              Сохранить
            </button>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
