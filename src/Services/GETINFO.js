class GETINFO {
  static async getDevice(id) { // добавляем параметр id для передачи
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
