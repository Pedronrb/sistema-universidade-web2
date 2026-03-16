import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [criando, setCriando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    papelNome: "aluno",
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const data = await api.get("/users");
      setUsuarios(data.data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function criarUsuario(e) {
    e.preventDefault();
    try {
      await api.post("/users", {
        nome: form.nome,
        email: form.email,
        senha: form.senha,
        papelNome: form.papelNome,
      });
      setMsgSucesso("Usuário criado com sucesso!");
      setForm({ nome: "", email: "", senha: "", papelNome: "aluno" });
      setCriando(false);
      carregar();
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  async function deletarUsuario(id) {
    if (!confirm("Deseja remover este usuário?")) return;
    try {
      await api.delete(`/users/${id}`);
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Gerenciar Usuários</h2>
        <button className="btn-primary" onClick={() => setCriando(!criando)}>
          {criando ? "Cancelar" : "+ Novo Usuário"}
        </button>
      </div>

      {msgSucesso && <p className="msg-sucesso">{msgSucesso}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      {criando && (
        <form className="view-form" onSubmit={criarUsuario}>
          <input
            placeholder="Nome"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Senha"
            type="password"
            value={form.senha}
            onChange={(e) => setForm({ ...form, senha: e.target.value })}
            required
          />
          <select
            value={form.papelNome}
            onChange={(e) => setForm({ ...form, papelNome: e.target.value })}
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="coordenador">Coordenador</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn-primary">
            Criar
          </button>
        </form>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="view-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Papel</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge">{u.papeis[0]}</span>
                </td>
                <td>
                  <button
                    className="btn-danger-sm"
                    onClick={() => deletarUsuario(u.id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
