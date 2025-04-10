import { useState } from "react";
import { useNavigate } from "react-router-dom";

const users = {
  1: "Bilal",
  2: "Ahmet",
  3: "Mehmet",
};

const UserSelect = () => {
  const [partnerId, setPartnerId] = useState("");
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId");

  if (!userId) {
    navigate("/");
    return null;
  }

  const startChat = () => {
    if (!partnerId) {
      alert("Lütfen bir kullanıcı seçin");
      return;
    }
    sessionStorage.setItem("partnerId", partnerId);
    navigate("/chat");
  };

  return (
    <div>
      <h2>Sohbet Başlat</h2>
      <p>Hoş geldin {users[userId]}</p>
      <select onChange={(event) => setPartnerId(event.target.value)}>
        <option value="">Bir kullanıcı seçin</option>
        {Object.entries(users)
          .filter(([id]) => id !== userId)
          .map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
      </select>
      <button onClick={startChat}>Sohbete Başla</button>
    </div>
  );
};

export default UserSelect;
