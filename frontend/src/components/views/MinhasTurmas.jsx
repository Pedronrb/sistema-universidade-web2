import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

export default function MinhasTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [turmaSelecionada, setTurmaSelecionada] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loadingAlunos, setLoadingAlunos] = useState(false);
  const payload = getTokenPayload();

  useEffect(() => {
    api
      .get("/turmas")
      .then((d) =>
        setTurmas((d.data || d).filter((t) => t.professorId === payload?.id)),
      )
      .finally(() => setLoading(false));
  }, []);

  async function verAlunos(turma) {
    if (turmaSelecionada?.id === turma.id) {
      setTurmaSelecionada(null);
      setAlunos([]);
      return;
    }
    setTurmaSelecionada(turma);
    setLoadingAlunos(true);
    try {
      const data = await api.get("/matriculas");
      const matriculasDaTurma = (data.data || data).filter(
        (m) => m.turmaId === turma.id,
      );
      setAlunos(matriculasDaTurma);
    } finally {
      setLoadingAlunos(false);
    }
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Minhas Turmas</h2>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <table className="view-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Disciplina</th>
                <th>Período</th>
                <th>Alunos</th>
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
                  <td>{t.periodo}</td>
                  <td>{t.matriculas?.length || 0}</td>
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

              {loadingAlunos ? (
                <p>Carregando alunos...</p>
              ) : alunos.length === 0 ? (
                <p style={{ color: "#777", fontSize: 13 }}>
                  Nenhum aluno matriculado.
                </p>
              ) : (
                <table className="view-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nome</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunos.map((m, i) => (
                      <tr key={m.id}>
                        <td>{i + 1}</td>
                        <td>{m.usuario?.nome || `Aluno #${m.usuarioId}`}</td>
                        <td>{m.usuario?.email || "—"}</td>
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
