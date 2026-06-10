import{ useEffect, useState } from "react";
import api from "../api/api";
import Sidebar from "../components/Sidebar";
import { colors } from "../styles/theme";

function Availability() {
    const [ availability, setAvailability ] = useState([]);
    const [ businesses, setBusinesses ] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [editForm, setEditForm] = useState({
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    });

    const [form, setForm] = useState({
        dayOfWeek: "",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const [availabilityRes, businessesRes] = await Promise.all([
            api.get("/Availability"),
            api.get("/Business"),
        ]);

        setAvailability(availabilityRes.data);
        setBusinesses(businessesRes.data);
    }

    async function createAvailability(e) {
        e.preventDefault();

        await api.post("/Availability", {
            dayOfWeek: Number(form.dayOfWeek),
            startTime: form.startTime,
            endTime: form.endTime,
            businessId: businesses[0]?.id,
        });

        setForm({
            dayOfWeek: "",
            startTime: "",
            endTime: "",
        });

        loadData();
    }

    function startEdit(item) {
      setEditingId(item.id);

      setEditForm({
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
      });
    }

    async function updateAvailability(e) {
      e.preventDefault();

      await api.put(`/Availability/${editingId}`, {
        dayOfWeek: Number(editForm.dayOfWeek),
        startTime: editForm.startTime,
        endTime: editForm.endTime,
      });

      setEditingId(null);
      loadData();
    }

    async function deleteAvailability(id) {
      if (!confirm("Deseja excluir este horário?")) return;

      await api.delete(`/Availability/${id}`);
      loadData();
    }

    const days = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
    ];

    return (
        <div style={{ 
            display: "flex",
            minHeight: "100vh",
            backgroundColor: colors.background,
            color: colors.text,
        }}>
            <Sidebar />
            <main style={{ flex: 1, padding: "30px" }}>
                <h1 style={{fontSize: "3rem", textAlign: "center"}}>Disponibilidade</h1>

                <form onSubmit={createAvailability}
                    style={{ 
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginBottom: "30px",
                     }}>
                        <select 
                        required 
                        value={form.dayOfWeek} 
                        onChange={e => 
                        setForm({...form, dayOfWeek: e.target.value})}>
                            <option value="">Dia</option>

                            {days.map((day, index) => (
                                <option key={index} value={index}>
                                    {day}
                                </option>
                            ))};
                        </select>

                        <input
                            type="time"
                            value={form.startTime}
                            onChange={e => 
                                setForm({...form, startTime: e.target.value})}
                        required/>
                        <input
                            type="time"
                            value={form.endTime}
                            onChange={e => 
                                setForm({...form, endTime: e.target.value})}
                        required/>
                        <button type="submit">Salvar</button>
                </form>

                <div style={{ display: "grid", gap: "15px" }}>
                    {availability.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            background: colors.card,
                            padding: "20px",
                            borderRadius: "12px",
                            textAlign: "center",
                          }}
                        >
                          {editingId === item.id ? (
                            <form onSubmit={updateAvailability}>
                              <select
                                value={editForm.dayOfWeek}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, dayOfWeek: e.target.value })
                                }
                              >
                                {days.map((day, index) => (
                                  <option key={index} value={index}>
                                    {day}
                                  </option>
                                ))}
                              </select>
                            
                              <input
                                type="time"
                                value={editForm.startTime}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, startTime: e.target.value })
                                }
                              />

                              <input
                                type="time"
                                value={editForm.endTime}
                                onChange={(e) =>
                                  setEditForm({ ...editForm, endTime: e.target.value })
                                }
                              />

                              <button type="submit">Salvar</button>
                            
                              <button type="button" onClick={() => setEditingId(null)}>
                                Cancelar
                              </button>
                            </form>
                          ) : (
                            <>
                              <h3>{days[item.dayOfWeek]}</h3>
                        
                              <p>
                                {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
                              </p>
                        
                              <button onClick={() => startEdit(item)}>Editar</button>
                        
                              <button onClick={() => deleteAvailability(item.id)}>
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

export default Availability;