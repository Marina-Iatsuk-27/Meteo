
class GETLIST{
    static async getDevicesList() {
        const token = import.meta.env.VITE_TOKEN;
        try {
          const response = await fetch(`api/v1/objects/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          
          if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
          }
        //   console.log(response);
          return await response.json();
          
        } catch (error) {
          console.error('Ошибка:', error);
          return false; // при ошибке вернёт false
        }
      }
}
export default GETLIST


