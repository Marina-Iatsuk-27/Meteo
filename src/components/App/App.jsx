import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import Header from '../Header/Header';
import Home from '../../pages/Home/Home';
import DeviceInfo from '../../pages/Device/Device';
import Authorisation from '../Authorisation/Authorisation';
import Library from '../../pages/Library/Library';

function App() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={!token ? <Authorisation /> : <Navigate to="/" />} />
        
        <Route
          path="/"
          element={token ? <Home /> : <Navigate to="/login" replace />}
        />
        
        <Route
          path="/device/:id"
          element={token ? <DeviceInfo /> : <Navigate to="/login" replace />}
        />
        
        <Route
          path="/library"
          element={token ? <Library /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;