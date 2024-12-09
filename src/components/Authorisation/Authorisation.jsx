import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Authorisation.module.scss';

export default function Authorisation() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(true); // Режим "Логин" по умолчанию
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Хук для навигации

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        // Логин
        const response = await axios.post('/internal/login', { username, password });
        localStorage.setItem('token', response.data.token);
        setMessage('Вы успешно вошли в систему!');
        setError('');
        // Переход на домашнюю страницу
        navigate('/');
      } else {
        // Регистрация
        await axios.post('/internal/register', { username, password });
        setMessage('Регистрация успешна! Теперь вы можете войти.');
        setError('');
      }
    } catch (err) {
      setError(err.response?.data || 'Произошла ошибка');
      setMessage('');
    }
  };

  const toggleMode = () => {
    setIsLoginMode((prev) => !prev);
    setMessage('');
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className={styles.authorisation}>
      <h2 className={styles.authorisation__title}>
        {isLoginMode ? 'Вход' : 'Регистрация  (для админов)'}
      </h2>
      <form className={styles.authorisation__form} onSubmit={handleSubmit}>
        <input
          className={styles.authorisation__input}
          type="text"
          placeholder="Имя пользователя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className={styles.authorisation__input}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className={styles.authorisation__button} type="submit">
          {isLoginMode ? 'Войти' : 'Зарегистрировать пользователя'}
        </button>
      </form>
      {message && <p className={styles.authorisation__message}>{message}</p>}
      {error && <p className={styles.authorisation__error}>{error}</p>}
      <button className={styles.authorisation__toggle} onClick={toggleMode}>
        {isLoginMode ? 'Перейти к добавлению пользователей' : 'Перейти ко входу'}
      </button>
    </div>
  );
}
