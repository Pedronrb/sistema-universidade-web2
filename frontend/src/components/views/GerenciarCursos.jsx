import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function GerenciarCursos() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [criando, setCriando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nome: "", descricao: "" });
  const [formEdit, setFormEdit] = useState({ nome: "", descricao: "" });

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

  function iniciarEdicao(curso) {
    setEditando(curso.id);
    setFormEdit({ nome: curso.nome, descricao: curso.descricao || "" });
  }

  async function salvarEdicao(id) {
    try {
      await api.put(`/cursos/${id}`, formEdit);
      setMsgSucesso("Curso atualizado com sucesso!");
      setEditando(null);
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
                <td>
                  {editando === c.id ? (
                    <input
                      value={formEdit.nome}
                      onChange={(e) =>
                        setFormEdit({ ...formEdit, nome: e.target.value })
                      }
                      style={{
                        height: 30,
                        padding: "0 8px",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        fontSize: 13,
                        backgroundColor: "#d9d9d9",
                        color: "#222",
                      }}
                    />
                  ) : (
                    c.nome
                  )}
                </td>
                <td>
                  {editando === c.id ? (
                    <input
                      value={formEdit.descricao}
                      onChange={(e) =>
                        setFormEdit({ ...formEdit, descricao: e.target.value })
                      }
                      style={{
                        height: 30,
                        padding: "0 8px",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        fontSize: 13,
                        backgroundColor: "#d9d9d9",
                        color: "#222",
                      }}
                    />
                  ) : (
                    c.descricao || "—"
                  )}
                </td>
                <td style={{ display: "flex", gap: 6 }}>
                  {editando === c.id ? (
                    <>
                      <button
                        className="btn-primary"
                        style={{ fontSize: 12, padding: "4px 10px" }}
                        onClick={() => salvarEdicao(c.id)}
                      >
                        Salvar
                      </button>
                      <button
                        className="btn-danger-sm"
                        onClick={() => setEditando(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn-primary"
                        style={{ fontSize: 12, padding: "4px 10px" }}
                        onClick={() => iniciarEdicao(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-danger-sm"
                        onClick={() => deletarCurso(c.id)}
                      >
                        Remover
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
