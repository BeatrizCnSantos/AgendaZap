import { useEffect, useState } from "react";
import api from "../api/api";
import StatCard from "../components/StatCard";
import Sidebar from "../components/Sidebar";
import { colors } from "../styles/theme";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      const response = await api.get("/Dashboard");
      setStats(response.data);
    }

    loadDashboard();
  }, []);

  if (!stats) {
    return <h2>Carregando...</h2>;
  }

  return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          background: colors.background,
          color: colors.text,
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            padding: "30px",
          }}
        >
          <h1 style={{marginBottom: "30px"}}>Painel de Controle</h1>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              marginTop: "20px",
            }}
          >
            <StatCard
              title="Empresas"
              value={stats.totalBusinesses}
            />

            <StatCard
              title="Serviços"
              value={stats.totalServices}
            />

            <StatCard
              title="Clientes"
              value={stats.totalCustomers}
            />

            <StatCard
              title="Agendamentos"
              value={stats.totalAppointments}
            />
          </div>
        </div>
      </div>
    );
}

export default Dashboard;