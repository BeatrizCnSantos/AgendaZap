import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { colors } from "../styles/theme";

function Businesses() {
  const [businesses, setBusinesses] = useState([]);

  const [form, setForm] = useState({
    name: "",
    whatsAppNumber: "",
    slug: "",
    logoUrl: "",
    address: "",
    instagram: "",
    description: "",
    openingHours: "",
  });

  useEffect(() => {
    loadBusinesses();
  }, []);

  async function loadBusinesses() {
    const response = await api.get("/Business");
    setBusinesses(response.data);
    if (response.data.length > 0) {
      const business = response.data[0];

      setForm({
        name: business.name || "",
        whatsAppNumber: business.whatsAppNumber || "",
        slug: business.slug || "",
        logoUrl: business.logoUrl || "",
        address: business.address || "",
        instagram: business.instagram || "",
        description: business.description || "",
        openingHours: business.openingHours || "",
      });
    }
  }

  async function createBusiness(e) {
    e.preventDefault();

    await api.post("/Business", {
      name: form.name,
      whatsAppNumber: form.whatsAppNumber,
      slug: form.slug,
    });

    setForm({
      name: "",
      whatsAppNumber: "",
      slug: "",
    });

    loadBusinesses();
  }

    async function updateBusiness(e) {
      e.preventDefault();

      if (businesses.length === 0) return;

      await api.put(`/Business/${businesses[0].id}`, {
        name: form.name,
        whatsAppNumber: form.whatsAppNumber,
        slug: form.slug,
        logoUrl: form.logoUrl,
        address: form.address,
        instagram: form.instagram,
        description: form.description,
        openingHours: form.openingHours,
      });

      loadBusinesses();
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
        <h1 style={{ fontSize: "3rem", textAlign: "center" }}>Minha Empresa</h1>

        <form
          onSubmit={businesses.length > 0? updateBusiness: createBusiness}
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
          <input
            placeholder="Nome da empresa"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            placeholder="WhatsApp: 5511999999999"
            value={form.whatsAppNumber}
            onChange={(e) =>
              setForm({ ...form, whatsAppNumber: e.target.value })
            }
            required
          />

          <input
            placeholder="Slug: studio-bella"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />

          <input
            placeholder="URL da Logo"
            value={form.logoUrl}
            onChange={(e) =>
              setForm({ ...form, logoUrl: e.target.value })
            }
          />  
          <input
            placeholder="Endereço"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />  
          <input
            placeholder="Instagram"
            value={form.instagram}
            onChange={(e) =>
              setForm({ ...form, instagram: e.target.value })
            }
          />  
          <textarea
            placeholder="Descrição"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />  

          <button type="submit">
            {businesses.length > 0 ? "Atualizar Empresa" : "Criar Empresa"}
          </button>
        </form>

        <div style={{ display: "grid", gap: "15px" }}>
          {businesses.map((business) => (
            <div
              key={business.id}
              style={{
                background: colors.card,
                padding: "25px",
                borderRadius: "14px",
                textAlign: "center",
              }}
            >
              <h2>{business.name}</h2>
              <p>WhatsApp: {business.whatsAppNumber}</p>
              <p>Link público de agendamento:</p>
              <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <input
                    value={`${window.location.origin}/agendar/${business.slug}`}
                    readOnly
                    style={{
                      width: "350px",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "none",
                    }}
                  />

                  <button
                    onClick={() =>
                      window.open(
                        `${window.location.origin}/agendar/${business.slug}`,
                        "_blank"
                      )
                    }
                  >
                    Abrir
                  </button>
                
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/agendar/${business.slug}`
                      );
                    }}
                  >
                    Copiar
                  </button>
                </div>
        </div>
        ))}
        </div>
      </main>
    </div>
  );
}

export default Businesses;