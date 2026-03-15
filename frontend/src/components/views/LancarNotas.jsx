import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

export default function LancarNotas() {
  const [turmas, setTurmas] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [form, setForm] = useState({ matriculaId: "", valor: "", etapa: "P1" });
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
    api
      .get("/matriculas")
      .then((d) =>
        setMatriculas(
          (d.data || d).filter((m) => m.turmaId === Number(turmaSelecionada)),
        ),
      );
  }, [turmaSelecionada]);

  async function lancarNota(e) {
    e.preventDefault();
    try {
      await api.post("/notas", {
        matriculaId: Number(form.matriculaId),
        valor: Number(form.valor),
        etapa: form.etapa,
      });
      setMsgSucesso("Nota lançada com sucesso!");
      setForm({ matriculaId: "", valor: "", etapa: "P1" });
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

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

          {turmaSelecionada && (
            <form className="view-form" onSubmit={lancarNota}>
              <select
                value={form.matriculaId}
                onChange={(e) =>
                  setForm({ ...form, matriculaId: e.target.value })
                }
                required
              >
                <option value="">Selecione o aluno</option>
                {matriculas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.usuario?.nome || `Matrícula #${m.id}`}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                placeholder="Nota (0-10)"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
                required
              />
              <select
                value={form.etapa}
                onChange={(e) => setForm({ ...form, etapa: e.target.value })}
              >
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
                <option value="Final">Final</option>
              </select>
              <button type="submit" className="btn-primary">
                Lançar
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
