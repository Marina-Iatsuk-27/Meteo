import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import styles from './Authorisation.module.scss';

export default function Authorisation() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLoginMode ? '/login' : '/register';
      const response = await axios.post(`http://localhost:5001${endpoint}`, { 
        username, 
        password 
      });

      console.log('username:',username, 'password:',password);
      

      if (isLoginMode) {
        login(response.data.token,username);
        navigate('/');
      } else {
        setMessage('Регистрация успешна! Теперь войдите.');
        setIsLoginMode(true);
      }
    } catch (err) {
      setError(err.response?.data || 'Ошибка сервера');
    }
  };

  return (
    <div className={styles.authorisation}>
      <h2>{isLoginMode ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Имя пользователя"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          required
        />
        <button type="submit">
          {isLoginMode ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
      {message && <p>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <button onClick={() => setIsLoginMode(!isLoginMode)}>
        {isLoginMode ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
      </button>
    </div>
  );
}