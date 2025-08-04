import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import style from './Excel.module.scss'

const Excel = () => {
  const [data, setData] = useState([]); // Храним данные из Excel

  // Обработчик загрузки файла на сайт
  const handleFile = (event) => {
    const file = event.target.files[0]; // Получаем выбранный файл 0-первая страница
    console.log(file);
    console.log(file.name);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryData = new Uint8Array(e.target.result); // Преобразуем файл в массив байтов
      const workbook = XLSX.read(binaryData, { type: 'array' }); // Читаем Excel-файл

      // Берем данные с первой страницы
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      console.log('sheet ',sheet);

      // Преобразуем данные в JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      console.log('jsonData ',jsonData);
      setData(jsonData); // Сохраняем данные в state
    };
    reader.readAsArrayBuffer(file); // Читаем файл
  };

// Функция для скачивания шаблона с сайта
const downloadTemplate = () => {
  // Определяем заголовки
  const headers = [
    ["ID (не менять ID и порядок показателей!)", "Показатель", "Минимальное значение показателя", "Максимальное значение показателя", "Регион, культуру или название справочника"],
  ];

  // Данные для первой строки
  const placeholderRow = [
    ["1", "Температура воздуха", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
    ["2", "Влажность воздуха", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
    ["3", "Атмосферное давление", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
    ["5", "Направление ветра", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
    ["6", "Проводимость почвы", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
    ["7", "PH почвы", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
    ["8", "Температура почвы", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
    ["9", "Кол-во азота в почве", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
    ["10", "Кол-во фосфора в почве", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
    ["11", "Кол-во калия в почве", "Указать здесь значение показателя", "Указать здесь значение показателя", ""],
  ];

  // Объединяем заголовки и placeholder-строки
  const worksheetData = [...headers, ...placeholderRow];

  // Создаем рабочий лист
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Устанавливаем ширину колонок
  worksheet["!cols"] = [
    { wch: 30 }, // ID и примечание
    { wch: 25 }, // Показатель
    { wch: 35 }, // Минимальное значение
    { wch: 35 }, // Максимальное значение
    { wch: 50 }, // Регион или название библиотеки
  ];

  // Добавляем стили (если используешь xlsx-style)
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: C }); // Заголовки
    if (!worksheet[cellRef]) continue;

    worksheet[cellRef].s = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };
  }

  // Создаем рабочую книгу
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Шаблон");

  // Скачиваем файл
  XLSX.writeFile(workbook, "template.xlsx");
};


  return (
    <div className={style["form-container"]}>
      <h1 className={style["form-container__title"]}>Загрузить справочник</h1>
      <div className={style["form-container__upload-section"]}>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFile}
          className={style["form-container__file-input"]}
        />
        <button
          onClick={downloadTemplate}
          className={style["form-container__download-button"]}
        >
          Скачать шаблон
        </button>
       
      </div>
      <div className={style["form-container__note"]}>Выгрузите шаблон, заполните  и загрузите его в систему</div>
      
      {data.length > 0 && (
        <div className={style["form-container__table-section"]}>
          <p className={style["form-container__note-info"]}>Превью:</p>
          <table className={style["form-container__table"]}>
            <thead className={style["form-container__table-header"]}>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className={style["form-container__table-header-cell"]}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={style["form-container__table-body"]}>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className={style["form-container__table-row"]}>
                  {Object.values(row).map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className={style["form-container__table-cell"]}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button className={style["form-container__saveButton"]}>Сохранить справочник</button>
    </div>
  );
};

export default Excel;
