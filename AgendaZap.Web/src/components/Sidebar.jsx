import { Link } from "react-router-dom";
import { colors } from "../styles/theme";

function Sidebar() {
  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        background: colors.sidebar,
        padding: "20px",
        color: colors.text,
      }}
    >
      <h2>AgendaZap</h2>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          marginTop: "30px",
        }}
      >
        <Link to="/dashboard" style={{textDecoration: "none",color: colors.text, textAlign: "left"}}>Dashboard</Link>

        <Link to="/businesses" style={{textDecoration: "none",color: colors.text, textAlign: "left"}}>Minha Empresa</Link>

        <Link to="/services" style={{textDecoration: "none",color: colors.text, textAlign: "left"}}>Serviços</Link>

        <Link to="/customers" style={{textDecoration: "none",color: colors.text, textAlign: "left"}}>Clientes</Link>

        <Link to="/appointments" style={{textDecoration: "none",color: colors.text, textAlign: "left"}}>Agendamentos</Link>

        <Link to="/availability" style={{textDecoration: "none",color: colors.text, textAlign: "left"}}>Disponibilidade</Link>

        <button onClick={logout}
        style={{
        background: colors.primary,
        border: "none",
        padding: "15px",
        borderRadius: "8px",
        cursor: "pointer",
        color: colors.text,
        fontWeight: "bold",
        fontSize: "1rem",
        }}>Sair</button>
      </nav>
    </div>
  );
}

export default Sidebar;