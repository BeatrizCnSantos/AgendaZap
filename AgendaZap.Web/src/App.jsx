import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Customers from "./pages/Customers";
import Appointments from "./pages/Appointments";
import Availability from "./pages/Availability";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/availability" element={<Availability />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;