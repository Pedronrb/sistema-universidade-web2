import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function GerenciarDisciplinas() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [criando, setCriando] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    codigo: "",
    cargaHoraria: "",
    cursoId: "",
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const [d, c] = await Promise.all([
        api.get("/disciplinas"),
        api.get("/cursos"),
      ]);
      setDisciplinas(d.data || d);
      setCursos(c.data || c);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function criarDisciplina(e) {
    e.preventDefault();
    try {
      await api.post("/disciplinas", {
        nome: form.nome,
        codigo: form.codigo,
        cargaHoraria: Number(form.cargaHoraria),
        cursoId: Number(form.cursoId),
      });
      setMsgSucesso("Disciplina criada com sucesso!");
      setForm({ nome: "", codigo: "", cargaHoraria: "", cursoId: "" });
      setCriando(false);
      carregar();
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  async function deletarDisciplina(id) {
    if (!confirm("Deseja remover esta disciplina?")) return;
    try {
      await api.delete(`/disciplinas/${id}`);
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Gerenciar Disciplinas</h2>
        <button className="btn-primary" onClick={() => setCriando(!criando)}>
          {criando ? "Cancelar" : "+ Nova Disciplina"}
        </button>
      </div>

      {msgSucesso && <p className="msg-sucesso">{msgSucesso}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      {criando && (
        <form className="view-form" onSubmit={criarDisciplina}>
          <input
            placeholder="Nome da disciplina"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            required
          />
          <input
            placeholder="Código (ex: BD101)"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Carga horária"
            value={form.cargaHoraria}
            onChange={(e) => setForm({ ...form, cargaHoraria: e.target.value })}
            required
          />
          <select
            value={form.cursoId}
            onChange={(e) => setForm({ ...form, cursoId: e.target.value })}
            required
          >
            <option value="">Selecione o curso</option>
            {cursos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
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
              <th>Código</th>
              <th>Carga Horária</th>
              <th>Curso</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {disciplinas.map((d) => (
              <tr key={d.id}>
                <td>{d.nome}</td>
                <td>{d.codigo}</td>
                <td>{d.cargaHoraria}h</td>
                <td>{d.curso?.nome || "—"}</td>
                <td>
                  <button
                    className="btn-danger-sm"
                    onClick={() => deletarDisciplina(d.id)}
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
