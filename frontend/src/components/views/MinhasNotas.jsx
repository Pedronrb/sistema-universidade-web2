import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

const ETAPAS = ["P1", "P2", "P3", "Final"];
const ETAPAS_MEDIA = ["P1", "P2", "P3"];

function calcularMedia(notas) {
  const valores = ETAPAS_MEDIA.map(
    (e) => notas.find((n) => n.etapa === e)?.valor,
  );
  if (valores.some((v) => v === undefined || v === null)) return null;
  return (valores.reduce((acc, v) => acc + v, 0) / valores.length).toFixed(1);
}

function getSituacao(media) {
  if (media === null) return null;
  const m = Number(media);
  if (m >= 7) return { label: "Aprovado", cor: "#238636" };
  if (m >= 4) return { label: "Final", cor: "#b07d00" };
  return { label: "Reprovado", cor: "#cc4444" };
}

export default function MinhasNotas() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [matriculaSelecionada, setMatriculaSelecionada] = useState(null);
  const [notas, setNotas] = useState([]);
  const [loadingNotas, setLoadingNotas] = useState(false);
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

  async function verNotas(matricula) {
    if (matriculaSelecionada?.id === matricula.id) {
      setMatriculaSelecionada(null);
      setNotas([]);
      return;
    }
    setMatriculaSelecionada(matricula);
    setLoadingNotas(true);
    try {
      const data = await api.get(`/notas/matricula/${matricula.id}`);
      setNotas(data.data || data);
    } catch {
      setNotas([]);
    } finally {
      setLoadingNotas(false);
    }
  }

  function getNotaEtapa(etapa) {
    const nota = notas.find((n) => n.etapa === etapa);
    return nota ? nota.valor : null;
  }

  const media = calcularMedia(notas);
  const situacao = getSituacao(media);

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Minhas Notas</h2>
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
                      onClick={() => verNotas(m)}
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
                  Notas — {matriculaSelecionada.turma?.disciplina?.nome} (
                  {matriculaSelecionada.turma?.codigo})
                </h3>
                <button
                  onClick={() => {
                    setMatriculaSelecionada(null);
                    setNotas([]);
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

              {loadingNotas ? (
                <p>Carregando notas...</p>
              ) : (
                <table className="view-table">
                  <thead>
                    <tr>
                      {ETAPAS.map((e) => (
                        <th key={e}>{e}</th>
                      ))}
                      <th>Média</th>
                      <th>Situação</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {ETAPAS.map((etapa) => {
                        const valor = getNotaEtapa(etapa);
                        return (
                          <td key={etapa}>
                            {valor !== null ? (
                              <strong
                                style={{
                                  color: valor >= 5 ? "#238636" : "#cc4444",
                                }}
                              >
                                {valor}
                              </strong>
                            ) : (
                              <span style={{ color: "#aaa" }}>—</span>
                            )}
                          </td>
                        );
                      })}
                      <td>
                        {media !== null ? (
                          <strong style={{ color: situacao?.cor }}>
                            {media}
                          </strong>
                        ) : (
                          <span style={{ color: "#aaa" }}>—</span>
                        )}
                      </td>
                      <td>
                        {situacao !== null ? (
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: 12,
                              fontSize: 12,
                              fontWeight: "bold",
                              backgroundColor: situacao.cor + "22",
                              color: situacao.cor,
                              border: `1px solid ${situacao.cor}`,
                            }}
                          >
                            {situacao.label}
                          </span>
                        ) : (
                          <span style={{ color: "#aaa", fontSize: 12 }}>
                            Aguardando notas
                          </span>
                        )}
                      </td>
                    </tr>
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
