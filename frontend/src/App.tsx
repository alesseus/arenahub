import { BrowserRouter, Route, Routes } from "react-router";
import AccessoModale from "./components/AccessoModale";
import DettaglioTorneo from "./components/DettaglioTorneo";
import Navbar from "./components/Navbar";
import UtenteProvider from "./components/UtenteProvider";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Profilo from "./pages/Profilo";
import Tornei from "./pages/Tornei";

function App () {
  return (
    <BrowserRouter>
      <UtenteProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tornei" element={<Tornei />} />
          <Route path="/profilo" element={<Profilo />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <DettaglioTorneo />
        <AccessoModale />
      </UtenteProvider>
    </BrowserRouter>
  );
}

export default App;
