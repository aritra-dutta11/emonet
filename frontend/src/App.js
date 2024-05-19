import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import Roompage from "./pages/Home/Room";
import EmotionScreenComponent from "./emotion";
import ButtonComponent from "./button";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ButtonComponent />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/emotion" element={<EmotionScreenComponent />} />
      <Route path="/room/:roomId" element={<Roompage />} />
    </Routes>
  );
}

export default App;
