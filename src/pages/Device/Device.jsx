
import DeviceInfo from "../../components/DeviceInfo/DeviceInfo";
import GetDeviceInfo from "../../context/GetDeviceInfo";
import GetDeviceHistory from "../../context/GetDeviceHistory";
import DeviceHistory from "../../components/DeviceHistory/DeviceHistory"


function App() {
  return (
    <>
 
            <GetDeviceInfo>
              <DeviceInfo />
            </GetDeviceInfo>
            <GetDeviceHistory>
              <DeviceHistory/>
            </GetDeviceHistory>
            </>
         
  );
}

export default App;
