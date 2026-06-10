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

  const [rescheduleId, setRescheduleId] = useState(null);

  const [rescheduleForm, setRescheduleForm] = useState({
    appointmentDate: "",
    startTime: "",
    reason: "",
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

      const response = await api.post("/Appointment", {
        appointmentDate: form.appointmentDate,
        startTime: form.startTime,
        customerId: form.customerId,
        serviceId: form.serviceId,
        businessId: businesses[0].id,
      });

      if (response.data.whatsAppLink) {
        window.open(response.data.whatsAppLink, "_blank");
      }

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

  async function cancelAppointment(appointment) {
    const reason = prompt("Informe o motivo do cancelamento:");

    if (!reason) return;

    const confirmCancel = confirm(
      "Tem certeza que deseja cancelar este agendamento?"
    );

    if (!confirmCancel) return;

    if (!appointment.customerPhone) {
      alert("Cliente não possui telefone cadastrado.");
      return;
    }

    const phone = `55${appointment.customerPhone.replace(/\D/g, "")}`;

    const text =
      `Olá ${appointment.customerName}, seu agendamento de ${appointment.serviceName} no dia ${appointment.appointmentDate} às ${appointment.startTime.slice(0, 5)} foi cancelado. Motivo: ${reason}`;

    const whatsappUrl =
      `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");

    await api.delete(`/Appointment/${appointment.id}`);

    setMessage("Agendamento cancelado com sucesso!");
    loadData();
  }

  function startReschedule(appointment) {
    setRescheduleId(appointment.id);

    setRescheduleForm({
      appointmentDate: appointment.appointmentDate,
      startTime: appointment.startTime?.slice(0, 5),
      reason: "",
    });
  }

  async function rescheduleAppointment(e, appointment) {
    e.preventDefault();

    if (!appointment.customerPhone) {
      alert("Cliente não possui telefone cadastrado.");
      return;
    }

    const phone = `55${appointment.customerPhone.replace(/\D/g, "")}`;

    await api.put(`/Appointment/${appointment.id}`, {
      appointmentDate: rescheduleForm.appointmentDate,
      startTime: rescheduleForm.startTime,
    });

    const text =
      `Olá ${appointment.customerName}, seu agendamento de ${appointment.serviceName} foi remarcado para ${rescheduleForm.appointmentDate} às ${rescheduleForm.startTime}. Motivo: ${rescheduleForm.reason}`;

    const whatsappUrl =
      `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, "_blank");

    setRescheduleId(null);
    setMessage("Agendamento remarcado com sucesso!");
    loadData();
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
              <h2>
                {appointment.customerName ||
                  getCustomerName(appointment.customerId)}
              </h2>

              <p>
                {appointment.serviceName ||
                  getServiceName(appointment.serviceId)}
              </p>

              <p>
                {appointment.appointmentDate} às{" "}
                {appointment.startTime.slice(0, 5)}
              </p>

              <button onClick={() => startReschedule(appointment)}>
                Remarcar
              </button>

              <button onClick={() => cancelAppointment(appointment)}>
                Cancelar
              </button>

              {rescheduleId === appointment.id && (
                <form
                  onSubmit={(e) =>
                    rescheduleAppointment(e, appointment)
                  }
                  style={{
                    marginTop: "20px",
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  <input
                    type="date"
                    value={rescheduleForm.appointmentDate}
                    onChange={(e) =>
                      setRescheduleForm({
                        ...rescheduleForm,
                        appointmentDate: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    type="time"
                    value={rescheduleForm.startTime}
                    onChange={(e) =>
                      setRescheduleForm({
                        ...rescheduleForm,
                        startTime: e.target.value,
                      })
                    }
                    required
                  />

                  <textarea
                    placeholder="Motivo da remarcação"
                    value={rescheduleForm.reason}
                    onChange={(e) =>
                      setRescheduleForm({
                        ...rescheduleForm,
                        reason: e.target.value,
                      })
                    }
                    required
                  />

                  <button type="submit">
                    Confirmar Remarcação
                  </button>

                  <button
                    type="button"
                    onClick={() => setRescheduleId(null)}
                  >
                    Fechar
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Appointments;