
class GETLIST{
    static async getDevicesList() {
        //const token = import.meta.env.VITE_TOKEN;
        try {
          const response = await fetch(`/devices/summary`, {
          });

          
          if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} - ${response.statusText}`);
          }
           ////console.log(response);
          return await response.json();
          
        } catch (error) {
          console.error('Ошибка:', error);
          return false; 
        }
      }
}
export default GETLIST


