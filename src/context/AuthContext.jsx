import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);  // Добавляем состояние для пользователя
  const [isLoading, setIsLoading] = useState(true);

  // Проверяем токен и данные пользователя при загрузке
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Получаем пользователя из localStorage
    
    if (storedToken) {
      setToken(storedToken);
      
      // Если есть сохраненный пользователь, устанавливаем его
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken, username, role, id) => {
    localStorage.setItem('token', newToken);
    const userData = { username, role, id };
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null); //
  };
  

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);