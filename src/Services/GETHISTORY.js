
class GETHISTORY{
    static async getDevice(id) {
        
        // Устанавливаем границы интервала
        const fromDate = '2024-11-10T00:00'; // с 10 октября
            
        // Текущая дата и время
        //const toDate = new Date().toISOString().slice(0, 16); // Преобразуем текущую дату в формат YYYY-MM-DDThh:mm
        const toDate = '2024-11-10T00:00';
        const token = import.meta.env.VITE_TOKEN; //получение чувствительных данных из .env.local (не из .env, так как там они компилируются и становятся доступными)
        
        
        try {
          const response = await fetch(`/api/v1/objects/${id}/packets?from=${fromDate}&to=${toDate}`, {
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

          return false; // при ошибке вернёт false
        }
      }
}
export default GETHISTORY


