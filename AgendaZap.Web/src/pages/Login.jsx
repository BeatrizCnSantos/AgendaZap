import { useState } from "react";
import api from "../api/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const response = await api.post("/Auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);

      window.location.href = "/dashboard";
    } catch {
      setMessage("Email ou senha inválidos");
    }
  }

  return (
    <div>
      <h1>AgendaZap</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">
          Entrar
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Login;