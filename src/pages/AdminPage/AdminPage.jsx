import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import style from "./AdminPage.module.scss";
import { FaTrash, FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);

  // Загружаем пользователей
  useEffect(() => {
    fetch("http://localhost:5001/admin/users", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Ошибка загрузки пользователей:", err));
  }, [token]);

  // Добавление нового пользователя
  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) return alert("Заполните все поля!");

    await fetch("http://localhost:5001/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(newUser)
    });

    setNewUser({ username: "", password: "", role: "user" });
    window.location.reload();
  };

  // Удаление пользователя
  const handleDeleteUser = async (id) => {
    if (id === user.id) return alert("Вы не можете удалить самого себя!");

    await fetch(`http://localhost:5001/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className={style.adminPage}>
      <h1 className={style.title}>Управление пользователями</h1>

      {/* Форма добавления */}
      <div className={style.addUserForm}>
        <input
          type="text"
          placeholder="Имя пользователя"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />

        <div className={style.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          />
          <span
            className={style.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="user">Пользователь</option>
          <option value="admin">Админ</option>
        </select>

        <button onClick={handleAddUser}>Добавить</button>
      </div>

      {/* Список пользователей */}
      <ul className={style.userList}>
        {users.map(u => (
          <li key={u.id} className={style.userItem}>
            <span>{u.username} ({u.role})</span>
            {u.id !== user.id && (
              <button
                className={style.deleteBtn}
                onClick={() => handleDeleteUser(u.id)}
              >
                <FaTrash />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
