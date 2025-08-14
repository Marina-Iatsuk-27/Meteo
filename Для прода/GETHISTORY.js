
//на проде делаем фетч через "апи"
class GETHISTORY{
    static async getDevice(id) {
                
        try {
          const response = await fetch(`api/data/${id}`, {
            method: 'GET',
            headers: {
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


