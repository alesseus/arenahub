import { BrowserRouter, Route, Routes } from "react-router";
import AccessoModale from "./components/AccessoModale";
import Navbar from "./components/Navbar";
import UtenteProvider from "./components/UtenteProvider";
import Home from "./pages/Home";
import Tornei from "./pages/Tornei";
import DettaglioTorneo from "./pages/DettaglioTorneo";

function App () {
  return (
    <BrowserRouter>
      <UtenteProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tornei" element={<Tornei />} />
          <Route path="/tornei/:id" element={<DettaglioTorneo />} />
        </Routes>
        <AccessoModale />
      </UtenteProvider>
    </BrowserRouter>
  );
}

export default App;
