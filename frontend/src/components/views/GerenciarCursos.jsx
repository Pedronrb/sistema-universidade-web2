import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function GerenciarCursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [criando, setCriando] = useState(false);
  const [form, setForm] = useState({ nome: "", descricao: "" });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const data = await api.get("/cursos");
      setCursos(data.data || data);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function criarCurso(e) {
    e.preventDefault();
    try {
      await api.post("/cursos", form);
      setMsgSucesso("Curso criado com sucesso!");
      setForm({ nome: "", descricao: "" });
      setCriando(false);
      carregar();
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  async function deletarCurso(id) {
    if (!confirm("Deseja remover este curso?")) return;
    try {
      await api.delete(`/cursos/${id}`);
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Gerenciar Cursos</h2>
        <button className="btn-primary" onClick={() => setCriando(!criando)}>
          {criando ? "Cancelar" : "+ Novo Curso"}
        </button>
      </div>

      {msgSucesso && <p className="msg-sucesso">{msgSucesso}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      {criando && (
        <form className="view-form" onSubmit={criarCurso}>
          <input
            placeholder="Nome do curso"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <input
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
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
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((c) => (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{c.descricao || "—"}</td>
                <td>
                  <button
                    className="btn-danger-sm"
                    onClick={() => deletarCurso(c.id)}
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
