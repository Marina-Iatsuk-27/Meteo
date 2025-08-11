
class GETHISTORY{
    static async getDevice(id) {

        //если это разработка, то возьми тестовые данные:
        //   if (import.meta.env.MODE === 'development') {
        //     const testData = await import('../data/testHistory.json');
        //     return testData.default;
        // }
        //конец теста
        
          
        
        try {
          const response = await fetch(`/data/${id}`, {
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


