import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import style from "./AdminPage.module.scss";
import { FaTrash, FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";

export default function AdminPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: "", password: "", role: "user" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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

  const onAddUser = async () => {
    setLoading(true);
    setSuccessMessage("");
    try {
      await handleAddUser(newUser);
      setSuccessMessage("✅ Пользователь успешно добавлен!");
      setNewUser({ username: "", password: "", role: "user" }); // очистка формы
    } catch (err) {
      setSuccessMessage("❌ Ошибка при добавлении пользователя");
    } finally {
      setLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000); // сообщение исчезает через 3 сек
    }
  };
  // Смена роли пользователя 
    const handleChangeRole = async (id, newRole) => {
      if (id === user.id) return alert("Вы не можете менять свою роль!");

      await fetch(`http://localhost:5001/admin/users/${id}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)));
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
          className={style.inputField}
        />

        <div className={style.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Пароль"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className={style.inputField}
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
          className={style.inputField}
        >
          <option value="user">Пользователь</option>
          <option value="admin">Админ</option>
        </select>

        <button onClick={onAddUser} className={style.addBtn} disabled={loading}>
          {loading ? "Добавление..." : "Добавить"}
        </button>
      </div>

      {/* Лоадер */}
      {loading && <Loader text="Добавляем пользователя..." />}

      {/* Сообщение */}
      {successMessage && <div className={style.successMessage}>{successMessage}</div>}

      {/* Таблица пользователей */}
      <div className={style.userTableContainer}>
        <h3>Список пользователей:</h3>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>Имя</th>
              <th>Роль</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u.id}>
                <td>{u.id || index + 1}</td>
                <td>{u.username}</td>
                <td>{u.role}</td>
                <td>
                  {u.id !== user.id && (
                    <>
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeRole(u.id, e.target.value)}
                        className={style.roleSelect}
                      >
                        <option value="user">Пользователь</option>
                        <option value="admin">Администратор</option>
                      </select>

                      <button
                        className={style.deleteBtn}
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
