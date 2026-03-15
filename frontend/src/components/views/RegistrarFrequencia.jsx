import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

export default function RegistrarFrequencia() {
  const [turmas, setTurmas] = useState([]);
  const [matriculas, setMatriculas] = useState([]);
  const [turmaSelecionada, setTurmaSelecionada] = useState("");
  const [presencas, setPresencas] = useState({});
  const [loading, setLoading] = useState(true);
  const [msgSucesso, setMsgSucesso] = useState("");
  const [erro, setErro] = useState("");
  const payload = getTokenPayload();
  const hoje = new Date().toISOString().split("T")[0];

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
    api.get("/matriculas").then((d) => {
      const m = (d.data || d).filter(
        (m) => m.turmaId === Number(turmaSelecionada),
      );
      setMatriculas(m);
      const init = {};
      m.forEach((mat) => (init[mat.id] = true));
      setPresencas(init);
    });
  }, [turmaSelecionada]);

  async function salvarFrequencia() {
    try {
      await Promise.all(
        matriculas.map((m) =>
          api.post("/frequencias", {
            matriculaId: m.id,
            data: hoje,
            presente: presencas[m.id] ?? true,
          }),
        ),
      );
      setMsgSucesso("Frequência registrada com sucesso!");
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

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
            <span style={{ fontSize: 13, color: "#666" }}>Data: {hoje}</span>
          </div>

          {matriculas.length > 0 && (
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
                Salvar Frequência
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
