import { useState, useEffect } from "react";
import client from "../mqtt";
import "../App.css";

const users = {
  1: "Bilal",
  2: "Ahmet",
  3: "Mehmet",
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const userId = sessionStorage.getItem("userId");
  const partnerId = sessionStorage.getItem("partnerId");

  useEffect(() => {
    const privateTopic = `chat/private/${userId}`;

    // Kullanıcı özel mesaj konusuna abone oluyor
    client.subscribe(privateTopic);
    console.log(`Abone olunan konu: ${privateTopic}`);

    // Kullanıcı bağlandığında sunucuya bildiriyoruz
    client.publish("chat/connect", JSON.stringify({ userId, partnerId }));

    client.on("message", (topic, msg) => {
      if (topic !== privateTopic) return;

      try {
        const data = JSON.parse(msg.toString());
        console.log("Yeni Mesaj Alındı:", data);

        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("Hatalı mesaj:", msg.toString());
      }
    });

    return () => {
      client.unsubscribe(privateTopic);
      client.publish("chat/disconnect", JSON.stringify({ userId }));
    };
  }, [userId]);

  const sendMessage = () => {
    if (message.trim() && partnerId) {
      const payload = {
        userId: Number(userId),
        sender: users[userId] || `Kullanıcı ${userId}`,
        partnerId: Number(partnerId),
        message: message.trim(),
      };

      client.publish("chat/message", JSON.stringify(payload));
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Hoş Geldin {users[userId]}</h2>
      <p className="chat-partner">Sohbet: {users[partnerId]}</p>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <p
            key={i}
            className={`message ${
              Number(msg.userId) === Number(userId) ? "sent" : "received"
            }`}
          >
            <strong>{msg.sender}</strong>: {msg.message}
          </p>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mesajınızı yazın..."
        />
        <button onClick={sendMessage}>Gönder</button>
      </div>
    </div>
  );
};

export default Chat;
