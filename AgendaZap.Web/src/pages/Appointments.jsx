import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { colors } from "../styles/theme";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    customerId: "",
    serviceId: "",
    appointmentDate: "",
    startTime: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
      if (!message) return;

      const timer = setTimeout(() => {
        setMessage("");
      }, 3000);

      return () => clearTimeout(timer);
  }, [message]);

  async function loadData() {
    const [appointmentsRes, customersRes, servicesRes, businessesRes] =
      await Promise.all([
        api.get("/Appointment"),
        api.get("/Customer"),
        api.get("/Service"),
        api.get("/Business"),
      ]);

    setAppointments(appointmentsRes.data);
    setCustomers(customersRes.data);
    setServices(servicesRes.data);
    setBusinesses(businessesRes.data);
  }

  async function createAppointment(e) {
      e.preventDefault();

      try {
        if (businesses.length === 0) {
          setMessage("Cadastre uma empresa antes de criar agendamentos.");
          return;
        }

        await api.post("/Appointment", {
          appointmentDate: form.appointmentDate,
          startTime: form.startTime,
          customerId: form.customerId,
          serviceId: form.serviceId,
          businessId: businesses[0].id,
        });

        setMessage("Agendamento criado com sucesso!");

        setForm({
          customerId: "",
          serviceId: "",
          appointmentDate: "",
          startTime: "",
        });

        loadData();
      } catch (error) {
        setMessage(error.response?.data?.message || "Erro ao criar agendamento.");
      }
  }

  async function deleteAppointment(id) {
    if (!confirm("Deseja cancelar este agendamento?")) return;

    try {
      await api.delete(`/Appointment/${id}`);
      setMessage("Agendamento cancelado com sucesso!");
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || "Erro ao cancelar agendamento.");
    }
  }

  function getCustomerName(id) {
    return customers.find((c) => c.id === id)?.name || "Cliente";
  }

  function getServiceName(id) {
    return services.find((s) => s.id === id)?.name || "Serviço";
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

      <main style={{ flex: 1, padding: "30px" }}>
        <h1 style={{ fontSize: "3rem", textAlign: "center" }}>
          Agendamentos
        </h1>

        <form
          onSubmit={createAppointment}
          style={{
            background: "#1d1d1d",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "25px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <select
            value={form.customerId}
            onChange={(e) =>
              setForm({ ...form, customerId: e.target.value })
            }
            required
          >
            <option value="">Selecione o cliente</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </select>

          <select
            value={form.serviceId}
            onChange={(e) =>
              setForm({ ...form, serviceId: e.target.value })
            }
            required
          >
            <option value="">Selecione o serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={form.appointmentDate}
            onChange={(e) =>
              setForm({ ...form, appointmentDate: e.target.value })
            }
            required
          />

          <input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
            required
          />

          <button type="submit">Agendar</button>
        </form>

        {message && (
          <div
              style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                background: "#3307fc54",
                color: "white",
                padding: "12px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              }}
            >
              {message}
            </div>
        )}

        <div style={{ display: "grid", gap: "15px" }}>
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              style={{
                background: colors.card,
                padding: "25px",
                borderRadius: "14px",
                textAlign: "center",
              }}
            >
              <h2>{getCustomerName(appointment.customerId)}</h2>

              <p>{getServiceName(appointment.serviceId)}</p>

              <p>
                {appointment.appointmentDate} às{" "}
                {appointment.startTime}
              </p>

              <button onClick={() => deleteAppointment(appointment.id)}>
                Cancelar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Appointments;