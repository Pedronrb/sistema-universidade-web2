import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function GerenciarTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [criando, setCriando] = useState(false);
  const [form, setForm] = useState({
    codigo: "",
    periodo: "",
    disciplinaId: "",
    professorId: "",
  });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const [t, u, d] = await Promise.all([
        api.get("/turmas"),
        api.get("/users"),
        api.get("/disciplinas"),
      ]);
      setTurmas(t.data || t);
      setProfessores(
        (u.data || u).filter((u) => u.papeis.includes("professor")),
      );
      setDisciplinas(d.data || d);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function criarTurma(e) {
    e.preventDefault();
    try {
      await api.post("/turmas", {
        codigo: form.codigo,
        periodo: form.periodo,
        disciplinaId: Number(form.disciplinaId),
        professorId: Number(form.professorId),
      });
      setMsgSucesso("Turma criada com sucesso!");
      setForm({ codigo: "", periodo: "", disciplinaId: "", professorId: "" });
      setCriando(false);
      carregar();
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  async function deletarTurma(id) {
    if (!confirm("Deseja remover esta turma?")) return;
    try {
      await api.delete(`/turmas/${id}`);
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Gerenciar Turmas</h2>
        <button className="btn-primary" onClick={() => setCriando(!criando)}>
          {criando ? "Cancelar" : "+ Nova Turma"}
        </button>
      </div>

      {msgSucesso && <p className="msg-sucesso">{msgSucesso}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      {criando && (
        <form className="view-form" onSubmit={criarTurma}>
          <input
            placeholder="Código (ex: BD-2026-B)"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            required
          />
          <input
            placeholder="Período (ex: 2026/1)"
            value={form.periodo}
            onChange={(e) => setForm({ ...form, periodo: e.target.value })}
            required
          />
          <select
            value={form.disciplinaId}
            onChange={(e) => setForm({ ...form, disciplinaId: e.target.value })}
            required
          >
            <option value="">Selecione a disciplina</option>
            {disciplinas.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nome} ({d.codigo})
              </option>
            ))}
          </select>
          <select
            value={form.professorId}
            onChange={(e) => setForm({ ...form, professorId: e.target.value })}
            required
          >
            <option value="">Selecione o professor</option>
            {professores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
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
              <th>Código</th>
              <th>Disciplina</th>
              <th>Professor</th>
              <th>Período</th>
              <th>Alunos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {turmas.map((t) => (
              <tr key={t.id}>
                <td>{t.codigo}</td>
                <td>{t.disciplina?.nome}</td>
                <td>{t.professor?.nome}</td>
                <td>{t.periodo}</td>
                <td>{t.matriculas?.length || 0}</td>
                <td>
                  <button
                    className="btn-danger-sm"
                    onClick={() => deletarTurma(t.id)}
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
