class GETINFO {
  static async getDevice(id) { // добавляем параметр id для передачи

       //если это разработка, то возьми тестовые данные и найду объект с нужный айди (айди из devEui взят):
      //  if (import.meta.env.MODE === 'development') {
      //   const testData = await import('../data/testInfo.json');
        
      //   // Ищем устройство по id или _id
      //   const device = testData.default.find(d => d.id === id || d._id === id);
        
      //   if (!device) {
      //     console.error(`Устройство с ID ${id} не найдено в тестовых данных`);
      //     return null;
      //   }
        
      //   // Возвращаем данные в ожидаемом формате
      //   return {
      //     name: device.name,
      //     state: device.state
      //   };
      // }
      //конец теста


      const token = import.meta.env.VITE_TOKEN;

    

      try {
        const response = await fetch(`api/v1/objects/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
        }

        return await response.json();

      } catch (error) {
        console.error('Ошибка:', error);
        return false;
      }
    }
}

export default GETINFO;
