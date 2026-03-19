import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

function hojeFormatado() {
  const agora = new Date();
  const offset = agora.getTimezoneOffset();
  const local = new Date(agora.getTime() - offset * 60000);
  return local.toISOString().split("T")[0];
}

function normalizarData(dataStr) {
  if (!dataStr) return "";
  return dataStr.substring(0, 10);
}

export default function RegistrarFrequencia() {
  const [turmas, setTurmas] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [dataSelecionada, setDataSelecionada] = useState(hojeFormatado());
  const [presencas, setPresencas] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingFreq, setLoadingFreq] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState("");
  const [erro, setErro] = useState("");
  const [frequenciasExistentes, setFrequenciasExistentes] = useState({});
  const payload = getTokenPayload();

  useEffect(() => {
    api
      .get("/turmas")
      .then((d) =>
        setTurmas((d.data || d).filter((t) => t.professorId === payload?.id)),
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!turmaSelecionada || !dataSelecionada) return;
    carregarFrequencias();
  }, [turmaSelecionada, dataSelecionada]);

  async function carregarFrequencias() {
    setLoadingFreq(true);
    setErro("");
    try {
      const d = await api.get("/matriculas");
      const m = (d.data || d).filter(
        (m) => m.turmaId === Number(turmaSelecionada),
      );
      setMatriculas(m);

      const existentes = {};
      const initPresencas = {};

      await Promise.all(
        m.map(async (mat) => {
          const f = await api
            .get(`/frequencias/matricula/${mat.id}`)
            .catch(() => []);
          const freqDia = (f.data || f).find(
            (freq) => normalizarData(freq.data) === dataSelecionada,
          );
          if (freqDia) {
            existentes[mat.id] = freqDia;
            initPresencas[mat.id] = freqDia.presente;
          } else {
            initPresencas[mat.id] = true;
          }
        }),
      );

      setFrequenciasExistentes(existentes);
      setPresencas(initPresencas);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoadingFreq(false);
    }
  }

  async function salvarFrequencia() {
    setErro("");
    try {
      const novas = matriculas.filter((m) => !frequenciasExistentes[m.id]);
      const existentes = matriculas.filter((m) => frequenciasExistentes[m.id]);

      await Promise.all([
        ...novas.map((m) =>
          api.post("/frequencias", {
            matriculaId: m.id,
            data: dataSelecionada,
            presente: presencas[m.id] ?? true,
          }),
        ),
        ...existentes.map((m) =>
          api.put(`/frequencias/${frequenciasExistentes[m.id].id}`, {
            presente: presencas[m.id] ?? true,
          }),
        ),
      ]);

      setMsgSucesso("Frequência salva com sucesso!");
      carregarFrequencias();
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  const totalPresentes = Object.values(presencas).filter(Boolean).length;
  const totalFaltas = matriculas.length - totalPresentes;
  const jaRegistrado = Object.keys(frequenciasExistentes).length > 0;

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Registrar Frequência</h2>
      </div>
      {msgSucesso && <p className="msg-sucesso">{msgSucesso}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="view-form" style={{ marginBottom: 24 }}>
            <select
              value={turmaSelecionada}
              onChange={(e) => {
                setTurmaSelecionada(e.target.value);
                setMatriculas([]);
              }}
            >
              <option value="">Selecione uma turma</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.codigo} — {t.disciplina?.nome}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label style={{ fontSize: 12, color: "#555" }}>
                Data da aula
              </label>
              <input
                type="date"
                value={dataSelecionada}
                onChange={(e) => setDataSelecionada(e.target.value)}
                max={hojeFormatado()}
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  fontSize: 13,
                  fontFamily: "Tahoma, Geneva, sans-serif",
                  backgroundColor: "#d9d9d9",
                  color: "#222",
                }}
              />
            </div>
          </div>

          {turmaSelecionada && dataSelecionada && (
            <>
              {!loadingFreq && matriculas.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                    padding: "10px 14px",
                    borderRadius: 8,
                    backgroundColor: jaRegistrado ? "#fff8e1" : "#f0faf0",
                    border: `1px solid ${jaRegistrado ? "#f0c040" : "#a8d8a8"}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ fontSize: 16 }}>
                    {jaRegistrado ? "✏️" : "📋"}
                  </span>
                  <span
                    style={{
                      color: jaRegistrado ? "#b07d00" : "#238636",
                      fontWeight: "bold",
                    }}
                  >
                    {jaRegistrado
                      ? "Frequência já registrada para este dia — você está editando."
                      : "Nenhum registro para este dia — novo lançamento."}
                  </span>
                  <span style={{ marginLeft: "auto", color: "#555" }}>
                    {totalPresentes} presentes · {totalFaltas} faltas
                  </span>
                </div>
              )}

              {loadingFreq ? (
                <p>Carregando...</p>
              ) : matriculas.length === 0 ? (
                <p style={{ color: "#777", fontSize: 13 }}>
                  Nenhum aluno matriculado nesta turma.
                </p>
              ) : (
                <>
                  <table className="view-table">
                    <thead>
                      <tr>
                        <th>Aluno</th>
                        <th>Presente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matriculas.map((m) => (
                        <tr key={m.id}>
                          <td>{m.usuario?.nome || `Aluno #${m.usuarioId}`}</td>
                          <td>
                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                cursor: "pointer",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={presencas[m.id] ?? true}
                                onChange={(e) =>
                                  setPresencas({
                                    ...presencas,
                                    [m.id]: e.target.checked,
                                  })
                                }
                              />
                              <span
                                style={{
                                  fontSize: 12,
                                  color: presencas[m.id]
                                    ? "#238636"
                                    : "#cc4444",
                                  fontWeight: "bold",
                                }}
                              >
                                {presencas[m.id] ? "Presente" : "Falta"}
                              </span>
                            </label>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    className="btn-primary"
                    style={{ marginTop: 16 }}
                    onClick={salvarFrequencia}
                  >
                    {jaRegistrado
                      ? "Atualizar Frequência"
                      : "Salvar Frequência"}
                  </button>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
