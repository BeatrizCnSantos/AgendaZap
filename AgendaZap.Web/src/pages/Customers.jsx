import { useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { colors } from "../styles/theme";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/Customer");
    setCustomers(response.data);
  }

  async function handleCreateCustomer(e) {
    e.preventDefault();

    await api.post("/Customer", {
      name: form.name,
      phone: form.phone,
    });

    setForm({ name: "", phone: "" });
    setShowForm(false);
    loadCustomers();
  }

  function startEdit(customer) {
    setEditingId(customer.id);
    setEditForm({
      name: customer.name,
      phone: customer.phone,
    });
  }

  async function handleUpdateCustomer(e) {
    e.preventDefault();

    await api.put(`/Customer/${editingId}`, {
      name: editForm.name,
      phone: editForm.phone,
    });

    setEditingId(null);
    loadCustomers();
  }

  async function deleteCustomer(id) {
    if (!confirm("Deseja excluir este cliente?")) return;

    await api.delete(`/Customer/${id}`);
    loadCustomers();
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
        <h1 style={{ fontSize: "3rem", textAlign: "center" }}>Clientes</h1>

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
            + Novo Cliente
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreateCustomer}
            style={{
              background: "#1d1d1d",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "25px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <input
              placeholder="Nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Telefone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <button type="submit">Salvar</button>
          </form>
        )}

        <div style={{ display: "grid", gap: "15px" }}>
          {customers.map((customer) => (
            <div
              key={customer.id}
              style={{
                background: colors.card,
                padding: "25px",
                borderRadius: "14px",
                textAlign: "center",
              }}
            >
              {editingId === customer.id ? (
                <form onSubmit={handleUpdateCustomer}>
                  <input
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                  />

                  <input
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />

                  <br />
                  <br />

                  <button type="submit">Salvar</button>
                  <button type="button" onClick={() => setEditingId(null)}>
                    Cancelar
                  </button>
                </form>
              ) : (
                <>
                  <h2>{customer.name}</h2>
                  <p>{customer.phone}</p>

                  <button onClick={() => startEdit(customer)}>Editar</button>
                  <button onClick={() => deleteCustomer(customer.id)}>
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

export default Customers;