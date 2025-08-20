// RegionSelector.js
import React, { useState, useEffect } from 'react';
import styles from './RegionSelector.module.scss'; // правильный импорт стилей

const RegionSelector = ({ onRegionSelect, selectedRegion }) => {
  const [regions, setRegions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchRegions();
  }, []);

  const fetchRegions = async () => {
    try {
      const res = await fetch("http://localhost:5001/reference", {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token")
        }
      });
      const result = await res.json();
      setRegions(result);
    } catch (err) {
      console.error("Ошибка загрузки регионов:", err);
    }
  };

  const handleSelect = (region) => {
    localStorage.setItem('selectedRegion', JSON.stringify(region));
    onRegionSelect(region);
    setIsOpen(false);
  };

  const clearSelection = () => {
    localStorage.removeItem('selectedRegion');
    onRegionSelect(null);
  };

  return (
    <div className={styles.regionSelector}>
      <button 
        className={styles.regionButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedRegion ? `Регион: ${selectedRegion.region}` : 'Выбрать регион для сравнения'}
      </button>
      
      {isOpen && (
        <div className={styles.regionDropdown}>
          {regions.map(region => (
            <div
              key={region.id}
              className={styles.regionOption}
              onClick={() => handleSelect(region)}
            >
              {region.region}
            </div>
          ))}
        </div>
      )}
      
      {selectedRegion && (
        <button 
          className={styles.clearButton}
          onClick={clearSelection}
          title="Очистить выбор"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default RegionSelector;