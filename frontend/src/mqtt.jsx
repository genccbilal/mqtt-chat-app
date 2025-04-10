import mqtt from "mqtt";

const client = mqtt.connect("ws://localhost:9001");

client.on("connect", () => {
  console.log("MQTT bağlantısı başarılı!");
});

client.on("error", (err) => {
  console.error("MQTT bağlantı hatası:", err);
});

export default client;
