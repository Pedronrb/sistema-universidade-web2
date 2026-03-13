import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import para navegação SPA
import { useAuth } from "../services/useAuth";     // Import do nosso novo Hook
import { authService } from "../services/authService";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  
  // Pegamos a função login do contexto global
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Chama o serviço que você tem no authService.js
      // Lembre-se que o seu service deve retornar data.data (usuario e token)
      const data = await authService.login(email, senha);

      // 2. Alimenta o Contexto Global
      // Isso salva no localStorage E atualiza o estado 'user' simultaneamente
      login(data.usuario, data.token);

      // 3. Redireciona de forma suave para o Dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Email ou senha inválidos ou erro na conexão com o servidor.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Acesso ao Sistema</h2>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">
            Entrar
          </button>

          <div className="login-links">
            <a href="#">Esqueci minha senha?</a>
          </div>
        </form>
      </div>
    </div>
  );
}