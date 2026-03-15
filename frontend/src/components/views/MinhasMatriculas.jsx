import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

export default function MinhasMatriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const payload = getTokenPayload();

  useEffect(() => {
    api
      .get("/matriculas")
      .then((d) =>
        setMatriculas((d.data || d).filter((m) => m.usuarioId === payload?.id)),
      )
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Minhas Matrículas</h2>
      </div>
      {erro && <p className="msg-erro">{erro}</p>}
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="view-table">
          <thead>
            <tr>
              <th>Turma</th>
              <th>Disciplina</th>
              <th>Professor</th>
              <th>Período</th>
            </tr>
          </thead>
          <tbody>
            {matriculas.map((m) => (
              <tr key={m.id}>
                <td>{m.turma?.codigo || "—"}</td>
                <td>{m.turma?.disciplina?.nome || "—"}</td>
                <td>{m.turma?.professor?.nome || "—"}</td>
                <td>{m.turma?.periodo || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
