import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

const ETAPAS = ["P1", "P2", "P3", "Final"];

export default function LancarNotas() {
  const [turmas, setTurmas] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [notas, setNotas] = useState({});
  const [busca, setBusca] = useState("");
  const [notasExistentes, setNotasExistentes] = useState({});
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
    if (!turmaSelecionada) return;
    api.get("/matriculas").then(async (d) => {
      const m = (d.data || d).filter(
        (m) => m.turmaId === Number(turmaSelecionada),
      );
      setMatriculas(m);
      const existentes = {};
      await Promise.all(
        m.map(async (mat) => {
          const n = await api.get(`/notas/matricula/${mat.id}`).catch(() => []);
          existentes[mat.id] = n.data || n;
        }),
      );
      setNotasExistentes(existentes);
    });
    setNotas({});
    setBusca("");
  }, [turmaSelecionada]);

  const matriculasFiltradas = matriculas.filter((m) =>
    (m.usuario?.nome || "").toLowerCase().includes(busca.toLowerCase()),
  );

  function handleNota(matriculaId, etapa, valor) {
    setNotas((prev) => ({
      ...prev,
      [matriculaId]: { ...prev[matriculaId], [etapa]: valor },
    }));
  }

  function getNotaExistente(matriculaId, etapa) {
    return notasExistentes[matriculaId]?.find((n) => n.etapa === etapa) || null;
  }

  async function lancarNotas() {
    setErro("");
    const lancamentos = [];
    for (const [matriculaId, etapas] of Object.entries(notas)) {
      for (const [etapa, valor] of Object.entries(etapas)) {
        if (valor === "" || valor === undefined) continue;
        const num = Number(valor);
        if (isNaN(num) || num < 0 || num > 10) {
          setErro(`Nota inválida para etapa ${etapa}: deve ser entre 0 e 10.`);
          return;
        }
        lancamentos.push({
          matriculaId: Number(matriculaId),
          etapa,
          valor: num,
        });
      }
    }
    if (lancamentos.length === 0) {
      setErro("Preencha ao menos uma nota antes de salvar.");
      return;
    }
    try {
      await Promise.all(lancamentos.map((l) => api.post("/notas", l)));
      setMsgSucesso(`${lancamentos.length} nota(s) lançada(s) com sucesso!`);
      setNotas({});
      // Recarrega notas existentes
      const existentes = {};
      await Promise.all(
        matriculas.map(async (mat) => {
          const n = await api.get(`/notas/matricula/${mat.id}`).catch(() => []);
          existentes[mat.id] = n.data || n;
        }),
      );
      setNotasExistentes(existentes);
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  async function editarNota(notaId, novoValor) {
    try {
      await api.put(`/notas/${notaId}`, { valor: Number(novoValor) });
      setMsgSucesso("Nota atualizada com sucesso!");
      const existentes = {};
      await Promise.all(
        matriculas.map(async (mat) => {
          const n = await api.get(`/notas/matricula/${mat.id}`).catch(() => []);
          existentes[mat.id] = n.data || n;
        }),
      );
      setNotasExistentes(existentes);
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  async function deletarNota(notaId) {
    if (!confirm("Deseja remover esta nota?")) return;
    try {
      await api.delete(`/notas/${notaId}`);
      setMsgSucesso("Nota removida com sucesso!");
      const existentes = {};
      await Promise.all(
        matriculas.map(async (mat) => {
          const n = await api.get(`/notas/matricula/${mat.id}`).catch(() => []);
          existentes[mat.id] = n.data || n;
        }),
      );
      setNotasExistentes(existentes);
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  const inputStyle = {
    width: 60,
    height: 30,
    padding: "0 6px",
    border: "1px solid #ccc",
    borderRadius: 4,
    fontSize: 13,
    fontFamily: "Tahoma, Geneva, sans-serif",
    backgroundColor: "#d9d9d9",
    color: "#222",
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Lançar Notas</h2>
      </div>
      {msgSucesso && <p className="msg-sucesso">{msgSucesso}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="view-form" style={{ marginBottom: 20 }}>
            <select
              value={turmaSelecionada}
              onChange={(e) => setTurmaSelecionada(e.target.value)}
            >
              <option value="">Selecione uma turma</option>
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.codigo} — {t.disciplina?.nome}
                </option>
              ))}
            </select>
          </div>

          {turmaSelecionada && matriculas.length > 0 && (
            <>
              <div style={{ marginBottom: 16 }}>
                <input
                  placeholder="Buscar aluno..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
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

              <table className="view-table">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    {ETAPAS.map((e) => (
                      <th key={e}>{e}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {matriculasFiltradas.length === 0 ? (
                    <tr>
                      <td
                        colSpan={ETAPAS.length + 1}
                        style={{ color: "#777", textAlign: "center" }}
                      >
                        Nenhum aluno encontrado.
                      </td>
                    </tr>
                  ) : (
                    matriculasFiltradas.map((m) => (
                      <tr key={m.id}>
                        <td>{m.usuario?.nome || `Matrícula #${m.id}`}</td>
                        {ETAPAS.map((etapa) => {
                          const notaExistente = getNotaExistente(m.id, etapa);
                          return (
                            <td key={etapa}>
                              {notaExistente ? (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <EditableNota
                                    nota={notaExistente}
                                    onSave={editarNota}
                                  />
                                  <button
                                    onClick={() =>
                                      deletarNota(notaExistente.id)
                                    }
                                    title="Remover nota"
                                    style={{
                                      background: "none",
                                      border: "none",
                                      cursor: "pointer",
                                      color: "#cc4444",
                                      fontSize: 14,
                                      padding: 0,
                                    }}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  min="0"
                                  max="10"
                                  step="0.1"
                                  placeholder="—"
                                  value={notas[m.id]?.[etapa] ?? ""}
                                  onChange={(e) =>
                                    handleNota(m.id, etapa, e.target.value)
                                  }
                                  style={inputStyle}
                                />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <button
                className="btn-primary"
                style={{ marginTop: 16 }}
                onClick={lancarNotas}
              >
                Salvar Notas
              </button>
            </>
          )}

          {turmaSelecionada && matriculas.length === 0 && (
            <p style={{ color: "#777", fontSize: 13 }}>
              Nenhum aluno matriculado nesta turma.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function EditableNota({ nota, onSave }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(nota.valor);

  function salvar() {
    onSave(nota.id, valor);
    setEditando(false);
  }

  if (editando) {
    return (
      <div style={{ display: "flex", gap: 4 }}>
        <input
          type="number"
          min="0"
          max="10"
          step="0.1"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={{
            width: 55,
            height: 28,
            padding: "0 4px",
            border: "1px solid #238636",
            borderRadius: 4,
            fontSize: 13,
            backgroundColor: "#d9d9d9",
            color: "#222",
          }}
          autoFocus
        />
        <button
          onClick={salvar}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#238636",
            fontSize: 16,
          }}
        >
          ✓
        </button>
        <button
          onClick={() => setEditando(false)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#888",
            fontSize: 14,
          }}
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <span
      onClick={() => setEditando(true)}
      style={{
        cursor: "pointer",
        fontWeight: "bold",
        color: nota.valor >= 5 ? "#238636" : "#cc4444",
        textDecoration: "underline dotted",
      }}
      title="Clique para editar"
    >
      {nota.valor}
    </span>
  );
}
