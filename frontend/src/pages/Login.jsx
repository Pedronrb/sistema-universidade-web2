import React from "react";
import "../styles/Login.css";

export default function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login realizado");
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Usuário</label>
            <input type="text" />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input type="password" />
          </div>

          <button className="login-button">Entrar</button>

          <div className="login-links">
            <a href="#">Esqueci minha senha?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
