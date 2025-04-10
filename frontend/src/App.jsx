import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserSelect from "./pages/UserSelect";
import Chat from "./pages/Chat";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/users" element={<UserSelect />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;
