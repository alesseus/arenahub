import { BrowserRouter, Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tornei from "./pages/Tornei";
import DettaglioTorneo from "./pages/DettaglioTorneo";

function App () {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tornei" element={<Tornei />} />
        <Route path="/tornei/:id" element={<DettaglioTorneo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
