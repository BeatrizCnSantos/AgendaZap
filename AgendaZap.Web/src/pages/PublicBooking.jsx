import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/api";
import { colors } from "../styles/theme";

function PublicBooking() {
  const { slug } = useParams();

  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState({
    serviceId: "",
    name: "",
    phone: "",
    appointmentDate: "",
    startTime: "",
  });

  const [availableSlots, setAvailableSlots] = useState([]);

  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBusiness();
  }, []);

  async function loadAvailableSlots(serviceId, date) {
    if (!serviceId || !date) return;

    const response = await api.get(
      `/public/booking/${slug}/slots?serviceId=${serviceId}&date=${date}`
    );

    setAvailableSlots(response.data);
  }

  async function loadBusiness() {
    try {
      const response = await api.get(`/public/booking/${slug}`);
      setBusiness(response.data);
    } catch {
      setMessage("Empresa não encontrada.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const customerResponse = await api.post("/Customer", {
        name: form.name,
        phone: form.phone,
      });

      const appointmentResponse = await api.post("/Appointment", {
        appointmentDate: form.appointmentDate,
        startTime: form.startTime,
        customerId: customerResponse.data.id,
        serviceId: form.serviceId,
        businessId: business.id,
      });

      setMessage("Agendamento criado com sucesso!");

      if (appointmentResponse.data.whatsAppLink) {
        window.open(appointmentResponse.data.whatsAppLink, "_blank");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Erro ao criar agendamento."
      );
    }
  }

  const days = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  if (!business) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: colors.background,
          color: colors.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>{message || "Carregando..."}</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.background,
        color: colors.text,
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#1d1d1d",
          padding: "30px",
          borderRadius: "16px",
        }}
      >
        {business.logoUrl && (
          <img
            src={business.logoUrl}
            alt={business.name}
            style={{
              width: "120px",
              height: "120px",
              objectFit: "cover",
              borderRadius: "50%",
              marginBottom: "20px",
            }}
          />
          )}

        <h1>{business.name}</h1>
        <p>Agende seu horário online</p>

        {business.description && <p>{business.description}</p>}

        {business.address && <p>📍 {business.address}</p>}

        {business.instagram && <p>📸 {business.instagram}</p>}

        {business.availabilities?.length > 0 && (
          <div
            style={{
              background: colors.card,
              padding: "20px",
              borderRadius: "12px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            <h3>Horários de Atendimento</h3>
          
            {business.availabilities.map((item) => (
              <p key={item.id}>
                {days[item.dayOfWeek]}: {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
              </p>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "15px",
            marginTop: "25px",
          }}
        >
          <select
            value={form.serviceId}
            onChange={(e) => {
              const serviceId = e.target.value;

              setForm({ ...form, serviceId, startTime: "" });

              loadAvailableSlots(serviceId, form.appointmentDate);
            }}
            required
          >
            <option value="">Escolha o serviço</option>

            {business.services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - R$ {service.price}
              </option>
            ))}
          </select>

          <input
            placeholder="Seu nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            placeholder="Seu WhatsApp"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />

          <input
            type="date"
            value={form.appointmentDate}
            onChange={(e) =>{
              const appointmentDate = e.target.value;

              setForm({ ...form, appointmentDate, startTime: "" });
              
              loadAvailableSlots(form.serviceId, appointmentDate);
            }}
            required
          />

          <select
            value={form.startTime}
            onChange={(e) =>
              setForm({ ...form, startTime: e.target.value })
            }
            required
          >
            <option value="">Escolha um horário</option>
          
            {availableSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={{
              background: colors.primary,
              color: colors.text,
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Confirmar Agendamento
          </button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default PublicBooking;