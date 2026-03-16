import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

export default function MinhaFrequencia() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [matriculaSelecionada, setMatriculaSelecionada] = useState(null);
  const [frequencias, setFrequencias] = useState([]);
  const [loadingFreq, setLoadingFreq] = useState(false);
  const payload = getTokenPayload();

  useEffect(() => {
    async function carregar() {
      try {
        const data = await api.get("/matriculas");
        const minhas = (data.data || data).filter(
          (m) => m.usuarioId === payload?.id,
        );
        setMatriculas(minhas);
      } catch (e) {
        setErro(e.message);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  async function verFrequencia(matricula) {
    if (matriculaSelecionada?.id === matricula.id) {
      setMatriculaSelecionada(null);
      setFrequencias([]);
      return;
    }
    setMatriculaSelecionada(matricula);
    setLoadingFreq(true);
    try {
      const data = await api.get(`/frequencias/matricula/${matricula.id}`);
      setFrequencias(data.data || data);
    } catch {
      setFrequencias([]);
    } finally {
      setLoadingFreq(false);
    }
  }

  const totalAulas = frequencias.length;
  const totalPresencas = frequencias.filter((f) => f.presente).length;
  const totalFaltas = totalAulas - totalPresencas;
  const percentual =
    totalAulas > 0 ? ((totalPresencas / totalAulas) * 100).toFixed(1) : null;

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Minha Frequência</h2>
      </div>
      {erro && <p className="msg-erro">{erro}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : matriculas.length === 0 ? (
        <p style={{ color: "#777", fontSize: 13 }}>
          Nenhuma matrícula encontrada.
        </p>
      ) : (
        <>
          <table className="view-table">
            <thead>
              <tr>
                <th>Disciplina</th>
                <th>Turma</th>
                <th>Período</th>
              </tr>
            </thead>
            <tbody>
              {matriculas.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span
                      onClick={() => verFrequencia(m)}
                      style={{
                        color: "#238636",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontWeight:
                          matriculaSelecionada?.id === m.id ? "bold" : "normal",
                      }}
                    >
                      {m.turma?.disciplina?.nome || `Matrícula #${m.id}`}
                    </span>
                  </td>
                  <td>{m.turma?.codigo || "—"}</td>
                  <td>{m.turma?.periodo || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {matriculaSelecionada && (
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
                  Frequência — {matriculaSelecionada.turma?.disciplina?.nome} (
                  {matriculaSelecionada.turma?.codigo})
                </h3>
                <button
                  onClick={() => {
                    setMatriculaSelecionada(null);
                    setFrequencias([]);
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

              {loadingFreq ? (
                <p>Carregando frequência...</p>
              ) : frequencias.length === 0 ? (
                <p style={{ color: "#777", fontSize: 13 }}>
                  Nenhuma frequência registrada.
                </p>
              ) : (
                <>
                  {/* Resumo */}
                  <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                    <div style={resumoCard("#238636")}>
                      <span style={{ fontSize: 22, fontWeight: "bold" }}>
                        {totalPresencas}
                      </span>
                      <span style={{ fontSize: 12 }}>Presenças</span>
                    </div>
                    <div style={resumoCard("#cc4444")}>
                      <span style={{ fontSize: 22, fontWeight: "bold" }}>
                        {totalFaltas}
                      </span>
                      <span style={{ fontSize: 12 }}>Faltas</span>
                    </div>
                    <div
                      style={resumoCard(
                        Number(percentual) >= 75 ? "#238636" : "#cc4444",
                      )}
                    >
                      <span style={{ fontSize: 22, fontWeight: "bold" }}>
                        {percentual}%
                      </span>
                      <span style={{ fontSize: 12 }}>Frequência</span>
                    </div>
                  </div>

                  {/* Tabela de dias */}
                  <table className="view-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {frequencias
                        .slice()
                        .sort((a, b) => new Date(a.data) - new Date(b.data))
                        .map((f) => (
                          <tr key={f.id}>
                            <td>
                              {new Date(f.data).toLocaleDateString("pt-BR")}
                            </td>
                            <td>
                              <span
                                style={{
                                  padding: "3px 10px",
                                  borderRadius: 12,
                                  fontSize: 12,
                                  fontWeight: "bold",
                                  backgroundColor: f.presente
                                    ? "#23863622"
                                    : "#cc444422",
                                  color: f.presente ? "#238636" : "#cc4444",
                                  border: `1px solid ${f.presente ? "#238636" : "#cc4444"}`,
                                }}
                              >
                                {f.presente ? "✓ Presente" : "✗ Falta"}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function resumoCard(cor) {
  return {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 24px",
    borderRadius: 10,
    border: `1px solid ${cor}`,
    backgroundColor: cor + "11",
    color: cor,
    minWidth: 90,
    gap: 2,
  };
}
