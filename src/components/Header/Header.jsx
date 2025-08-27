import style from "./Header.module.scss";
import { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { token, user, logout } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.reload();
      }
    } catch (err) {
      console.error('Ошибка входа:', err);
    }
  };

  return (
    <header className={style.header}>
      <div className={style.headerContainer}>
        <div className={style.leftSection}>
          <div
            className={style.homeLogo}
            onClick={() => navigate('/')}
          >
            АгроМониторинг
          </div>

          <nav className={style.desktopNav}>
            <ul className={style.navMenu}>
              {token && (
                <>
                  <li
                    className={style.nav}
                    onClick={() => navigate('/')}
                  >
                    Главная
                  </li>
                  <li
                    className={style.nav}
                    onClick={() => navigate('/library')}
                  >
                    Справочник
                  </li>
                  <li
                    className={style.nav}
                    onClick={() => navigate('/map')}
                  >
                    Карта
                  </li>
                </>
              )}
            </ul>
          </nav>

        </div>

        <div className={style.rightSection}>
          {token ? (
            <div className={style.userProfile}>
            <div className={style.userInfo}>
              <FaUserCircle className={style.avatar} size={24} />
              <div className={style.userNameContainer}>
                <span className={style.userName}>Привет, {user?.username}!</span>
                <span className={style.userRole}>Роль: {user?.username === 'admin' ? 'агроном' : 'наблюдатель'}</span>
              </div>
              
            </div>
          
          
            {user?.role === "admin" && (
              <Link to="/admin" className={style.adminLink}>
                Админка
              </Link>
            )}
          
            <button className={style.logoutBtn} onClick={logout}>
              <FaSignOutAlt className={style.logoutIcon} />
              Выйти
            </button>
          </div>
          
          ) : (
            <>
              {loginOpen && (
                <div className={style.loginPopup}>
                  <form onSubmit={handleLogin} className={style.formPopup}>
                    <input
                      type="text"
                      placeholder="Логин"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Войти</button>
                  </form>
                </div>
              )}
            </>
          )}

          <div
            className={style.burger}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>

        {/* Мобильное меню */}
        <nav className={`${style.mobileNav} ${menuOpen ? style.active : ''}`}>
          <ul className={style.navMenu}>
            <li
              className={style.nav}
              onClick={() => {
                navigate('/');
                setMenuOpen(false);
              }}
            >
              Главная
            </li>
            <li
              className={style.nav}
              onClick={() => {
                navigate('/library');
                setMenuOpen(false);
              }}
            >
              Справочник
            </li>
            {!token && (
              <li
                className={style.nav}
                onClick={() => {
                  setLoginOpen(!loginOpen);
                  setMenuOpen(false);
                }}
              >
                Вход
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}