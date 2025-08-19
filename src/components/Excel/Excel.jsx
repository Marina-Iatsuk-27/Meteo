import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import style from './Excel.module.scss'

const Excel = ({ onSave }) => {
  const [rawData, setRawData] = useState([]);
  const [previewData, setPreviewData] = useState([]);

  const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryData = new Uint8Array(e.target.result);
      const workbook = XLSX.read(binaryData, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setRawData(jsonData);
      setPreviewData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Группируем данные по региону и показателю, собирая min/max
  const groupDataByRegion = (data) => {
    const grouped = {};
    let regionValue = "Не указан регион";
  
    data.forEach(item => {
      if (item["Показатель"] === "Регион, культуру или название справочника") {
        // Берём значение региона из min или max колонки (любой, где пользователь вписал текст)
        regionValue = item["Минимальное значение показателя"] || item["Максимальное значение показателя"] || "Не указан регион";
        return; // эту строку не добавляем в grouped
      }
    });
  
    data.forEach(item => {
      if (item["Показатель"] === "Регион, культуру или название справочника") {
        // Пропускаем строку региона
        return;
      }
      const indicator = item["Показатель"] || "";
      const minValue = item["Минимальное значение показателя"] || "-";
      const maxValue = item["Максимальное значение показателя"] || "-";
  
      // В группе будет только один регион, т.к. он один для всего справочника
      if (!grouped[regionValue]) {
        grouped[regionValue] = { region: regionValue };
      }
  
      const mapIndicatorToField = {
        "Температура воздуха": "airTemp",
        "Влажность воздуха": "airHumidity",
        "Атмосферное давление": "pressure",
        "Направление ветра": "windDirection",
        "Проводимость почвы": "soilConductivity",
        "PH почвы": "soilPH",
        "Температура почвы": "soilTemp",
        "Кол-во азота в почве": "nitrogen",
        "Кол-во фосфора в почве": "phosphorus",
        "Кол-во калия в почве": "potassium",
      };
  
      const field = mapIndicatorToField[indicator];
      if (field) {
        grouped[regionValue][field + "Min"] = minValue;
        grouped[regionValue][field + "Max"] = maxValue;
      }
    });
  
    return Object.values(grouped);
  };
  

  const downloadTemplate = () => {
    const headers = [
      ["ID (не менять ID и порядок показателей!)", "Показатель", "Минимальное значение показателя", "Максимальное значение показателя"],
    ];
    const placeholderRow = [
      ["1", "Температура воздуха", "", ""],
      ["2", "Влажность воздуха", "", ""],
      ["3", "Атмосферное давление", "", ""],
      ["5", "Направление ветра", "", ""],
      ["6", "Проводимость почвы", "", ""],
      ["7", "PH почвы", "", ""],
      ["8", "Температура почвы", "", ""],
      ["9", "Кол-во азота в почве", "", ""],
      ["10", "Кол-во фосфора в почве", "", ""],
      ["11", "Кол-во калия в почве", "", ""],
      ["12", "Регион, культуру или название справочника", "", ""],
    ];
    const worksheetData = [...headers, ...placeholderRow];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    worksheet["!cols"] = [
      { wch: 30 }, { wch: 25 }, { wch: 35 }, { wch: 35 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Шаблон");
    XLSX.writeFile(workbook, "шаблон_метео.xlsx");
  };
  
  // const saveData = () => {
  //   if (rawData.length === 0) {
  //     alert("Нет данных для сохранения");
  //     return;
  //   }
  //   const grouped = groupDataByRegion(rawData);
  //   //sessionStorage.setItem("libraryData", JSON.stringify(grouped));
  
    

  //   // Передаем данные наверх для обновления таблицы
  //   if (onSave) {
  //     onSave(grouped);
  //   }
  //   setPreviewData([]); // Очистить превью после сохранения
  //   alert("Данные сохранены и добавлены в таблицу");
  // };


  const saveData = async () => {
    if (rawData.length === 0) {
      alert("Нет данных для сохранения");
      return;
    }
  
    const grouped = groupDataByRegion(rawData);
  
    try {
      for (let entry of grouped) {
        await fetch("http://localhost:5001/reference", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token") // если токен хранится в localStorage
          },
          body: JSON.stringify(entry)
        });
      }
  
      if (onSave) {
        onSave(grouped);
      }
  
      setPreviewData([]);
      alert("Справочник сохранён в БД");
    } catch (error) {
      console.error("Ошибка при сохранении справочника:", error);
      alert("Ошибка сохранения");
    }
  };
  return (
    <div className={style["excelContainer"]}>
      <h1 className={style["excelContainer__title"]}>Загрузить справочник</h1>
      <div className={style["excelContainer__upload-section"]}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFile}
          className={style["excelContainer__file-input"]}
        />
        <button
          onClick={downloadTemplate}
          className={style["excelContainer__download-button"]}
        >
          Скачать шаблон
        </button>
      </div>
      <div className={style["excelContainer__note"]}>Выгрузите шаблон, заполните и загрузите его в систему</div>

      {previewData.length > 0 && (
        <div className={style["excelContainer__table-section"]}>
          <p className={style["excelContainer__note-info"]}>Превью:</p>
          <table className={style["excelContainer__table"]}>
            <thead className={style["excelContainer__table-header"]}>
              <tr>
                {Object.keys(previewData[0]).map((key) => (
                  <th key={key} className={style["excelContainer__table-header-cell"]}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody className={style["excelContainer__table-body"]}>
              {previewData.map((row, idx) => (
                <tr key={idx} className={style["excelContainer__table-row"]}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className={style["excelContainer__table-cell"]}>{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        className={style["excelContainer__saveButton"]}
        onClick={saveData}
      >
        Сохранить справочник
      </button>
    </div>
  );
};

export default Excel;
