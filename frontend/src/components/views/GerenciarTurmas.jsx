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
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const [buscaAluno, setBuscaAluno] = useState("");

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
      if (turmaSelecionada?.id === id) {
        setTurmaSelecionada(null);
        setAlunos([]);
      }
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function verAlunos(turma) {
    if (turmaSelecionada?.id === turma.id) {
      setTurmaSelecionada(null);
      setAlunos([]);
      setBuscaAluno("");
      return;
    }
    setTurmaSelecionada(turma);
    setBuscaAluno("");
    setLoadingAlunos(true);
    try {
      const data = await api.get("/matriculas");
      setAlunos((data.data || data).filter((m) => m.turmaId === turma.id));
    } finally {
      setLoadingAlunos(false);
    }
  }

  async function retirarAluno(matriculaId, nomeAluno) {
    if (!confirm(`Deseja retirar "${nomeAluno}" desta turma?`)) return;
    try {
      await api.delete(`/matriculas/${matriculaId}`);
      setAlunos((prev) => prev.filter((m) => m.id !== matriculaId));
      setMsgSucesso(`${nomeAluno} removido da turma com sucesso!`);
      carregar();
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  const alunosFiltrados = alunos.filter((m) =>
    (m.usuario?.nome || "").toLowerCase().includes(buscaAluno.toLowerCase()),
  );

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
        <>
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
                  <td>
                    <span
                      onClick={() => verAlunos(t)}
                      style={{
                        color: "#238636",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight:
                          turmaSelecionada?.id === t.id ? "bold" : "normal",
                      }}
                    >
                      {t.disciplina?.nome}
                    </span>
                  </td>
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

          {turmaSelecionada && (
            <div style={{ marginTop: 32 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <h3 style={{ margin: 0, fontSize: 15, color: "#222" }}>
                  Alunos — {turmaSelecionada.disciplina?.nome} (
                  {turmaSelecionada.codigo})
                </h3>
                <button
                  onClick={() => {
                    setTurmaSelecionada(null);
                    setAlunos([]);
                    setBuscaAluno("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "#888",
                  }}
                >
                  ✕ Fechar
                </button>
              </div>

              <div style={{ marginBottom: 16 }}>
                <input
                  placeholder="Buscar aluno..."
                  value={buscaAluno}
                  onChange={(e) => setBuscaAluno(e.target.value)}
                  style={{
                    height: 36,
                    padding: "0 12px",
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    fontSize: 13,
                    fontFamily: "Tahoma, Geneva, sans-serif",
                    width: 300,
                    backgroundColor: "#d9d9d9",
                    color: "#222",
                  }}
                />
              </div>

              {loadingAlunos ? (
                <p>Carregando alunos...</p>
              ) : alunosFiltrados.length === 0 ? (
                <p style={{ color: "#777", fontSize: 13 }}>
                  {alunos.length === 0
                    ? "Nenhum aluno matriculado."
                    : "Nenhum aluno encontrado."}
                </p>
              ) : (
                <table className="view-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosFiltrados.map((m, i) => (
                      <tr key={m.id}>
                        <td>{i + 1}</td>
                        <td>{m.usuario?.nome || `Aluno #${m.usuarioId}`}</td>
                        <td>{m.usuario?.email || "—"}</td>
                        <td>
                          <button
                            className="btn-danger-sm"
                            onClick={() =>
                              retirarAluno(
                                m.id,
                                m.usuario?.nome || `Aluno #${m.usuarioId}`,
                              )
                            }
                          >
                            Retirar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
