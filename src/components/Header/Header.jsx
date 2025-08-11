import style from "./Header.module.scss";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className={style.header}>
      <div className={style.headerContainer}>
        <div
          className={style.homeLogo}
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          АгроМониторинг
        </div>

        <div
          className={style.burger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </div>

        <nav>
          <ul className={`${style.navMenu} ${menuOpen ? style.active : ''}`}>
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
          </ul>
        </nav>
      </div>
    </header>
  );
}

