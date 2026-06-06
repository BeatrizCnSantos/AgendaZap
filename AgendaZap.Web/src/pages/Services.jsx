import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { colors } from "../styles/theme";

function Services() {
  const [services, setServices] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    durationMinutes: "",
    active: true,
  });

  useEffect(() => {
    loadServices();
    loadBusinesses();
  }, []);

  async function loadServices() {
    const response = await api.get("/Service");
    setServices(response.data);
  }

  async function loadBusinesses() {
    const response = await api.get("/Business");
    setBusinesses(response.data);
  }

  async function handleCreateService(e) {
    e.preventDefault();

    if (businesses.length === 0) {
      alert("Cadastre uma empresa antes de criar serviços.");
      return;
    }

    await api.post("/Service", {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      durationMinutes: Number(form.durationMinutes),
      businessId: businesses[0].id,
    });

    setForm({
      name: "",
      description: "",
      price: "",
      durationMinutes: "",
    });

    setShowForm(false);
    loadServices();
  }

  function startEdit(service) {
    setEditingId(service.id);

    setEditForm({
      name: service.name,
      description: service.description,
      price: service.price,
      durationMinutes: service.durationMinutes,
      active: service.active ?? true,
    });
  }

  async function handleUpdateService(e) {
    e.preventDefault();

    await api.put(`/Service/${editingId}`, {
      name: editForm.name,
      description: editForm.description,
      price: Number(editForm.price),
      durationMinutes: Number(editForm.durationMinutes),
      active: editForm.active,
    });

    setEditingId(null);
    loadServices();
  }

  async function deleteService(id) {
    if (!confirm("Deseja excluir este serviço?")) {
      return;
    }

    await api.delete(`/Service/${id}`);
    loadServices();
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
        <h1 style={{ fontSize: "3rem", textAlign: "center" }}>Serviços</h1>

        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: colors.primary,
              color: colors.text,
              border: "none",
              padding: "12px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + Novo Serviço
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreateService}
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
              placeholder="Nome do serviço"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Descrição"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Preço"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
              type="number"
              placeholder="Duração"
              value={form.durationMinutes}
              onChange={(e) =>
                setForm({ ...form, durationMinutes: e.target.value })
              }
            />

            <button type="submit">Salvar</button>
          </form>
        )}

        <div style={{ display: "grid", gap: "15px" }}>
          {services.map((service) => (
            <div
              key={service.id}
              style={{
                background: colors.card,
                padding: "25px",
                borderRadius: "14px",
                textAlign: "center",
              }}
            >
              {editingId === service.id ? (
                <form onSubmit={handleUpdateService}>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />

                  <input
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        description: e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                  />

                  <input
                    type="number"
                    value={editForm.durationMinutes}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        durationMinutes: e.target.value,
                      })
                    }
                  />

                  <br />
                  <br />

                  <button type="submit">Salvar</button>

                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                  >
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <h2>{service.name}</h2>
                  <p>{service.description}</p>
                  <p>Preço: R$ {service.price}</p>
                  <p>Duração: {service.durationMinutes} min</p>

                  <button onClick={() => startEdit(service)}>
                    Editar
                  </button>

                  <button onClick={() => deleteService(service.id)}>
                    Excluir
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Services;