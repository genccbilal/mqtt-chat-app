import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (userId) {
      sessionStorage.setItem("userId", userId);
      navigate("/users");
    } else {
      alert("Lütfen bir kullanıcı seçin!");
    }
  };

  return (
    <div className="login-container">
      <h2>Giriş Yap</h2>
      <select value={userId} onChange={(e) => setUserId(e.target.value)}>
        <option value="">Kullanıcı seçin</option>
        <option value="1">Bilal</option>
        <option value="2">Ahmet</option>
        <option value="3">Mehmet</option>
      </select>
      <button onClick={handleLogin} className="loginButton">
        Giriş Yap
      </button>
    </div>
  );
};

export default Login;
