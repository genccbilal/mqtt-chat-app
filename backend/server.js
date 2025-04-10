const mqtt = require("mqtt");

// Kullanıcı ID ve isimleri
const users = {
  1: "Bilal",
  2: "Ahmet",
  3: "Mehmet",
};

const clients = new Map(); // Kullanıcı bağlantılarını takip etmek için.

const mqttClient = mqtt.connect("mqtt://localhost:1883");

mqttClient.on("connect", () => {
  console.log("MQTT Broker'a bağlandı!");
  mqttClient.subscribe("chat/connect");
  mqttClient.subscribe("chat/disconnect");
  mqttClient.subscribe("chat/message");
});

mqttClient.on("message", (topic, message) => {
  let data;

  try {
    data = JSON.parse(message.toString());
  } catch (error) {
    console.error(`Hatalı mesaj alındı (${topic}):`, message.toString());
    return;
  }

  if (topic === "chat/connect") {
    // Eğer kullanıcı zaten bağlıysa, bağlantısını güncelle
    if (clients.has(data.userId)) {
      clients.delete(data.userId);
    }

    // userId ve partnerId'yi number olarak sakla
    clients.set(Number(data.userId), Number(data.partnerId));
    console.log(
      `🔗 ${users[data.userId]} bağlandı, partner: ${users[data.partnerId]}`
    );
  }

  if (topic === "chat/disconnect") {
    clients.delete(Number(data.userId));
    console.log(` ${users[data.userId]} ayrıldı`);
  }

  if (topic === "chat/message") {
    if (!data.userId || !data.partnerId || !data.message) {
      console.log(" Hatalı mesaj formatı:", data);
      return;
    }

    // Partner kontrolü - sadece karşılıklı bağlantısı olan kullanıcılar mesajlaşabilir
    const userId = Number(data.userId);
    const partnerId = Number(data.partnerId);
    const senderPartner = clients.get(userId);
    const receiverPartner = clients.get(partnerId);

    if (senderPartner !== partnerId || receiverPartner !== userId) {
      return;
    }

    console.log(` Mesaj Gönderiliyor -> ${users[partnerId]}`, data);

    mqttClient.publish(`chat/private/${partnerId}`, JSON.stringify(data));
    mqttClient.publish(`chat/private/${userId}`, JSON.stringify(data));
  }
});
