import React, { useState } from "react";
import "../styles/Login.css";

const API_URL = "http://localhost:3000/auth/login";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    if (!usuario.trim() || !senha.trim()) {
      setErro("Preencha o usuário e a senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: usuario, senha: senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.detail || "Usuário ou senha inválidos.",
        );
      }

      // Salva o Bearer token no localStorage
      const token = data.data.token;
      localStorage.setItem("token", token);

      window.location.href = "/dashboard";
    } catch (err) {
      setErro(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {erro && (
            <p
              style={{
                color: "#cc4444",
                fontSize: "13px",
                margin: "-20px 0",
                textAlign: "center",
              }}
            >
              {erro}
            </p>
          )}

          <button className="login-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="login-links">
            <a href="#">Esqueci minha senha?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
