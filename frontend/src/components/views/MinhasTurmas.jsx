import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

export default function MinhasTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const payload = getTokenPayload();

  useEffect(() => {
    api
      .get("/turmas")
      .then((d) =>
        setTurmas((d.data || d).filter((t) => t.professorId === payload?.id)),
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Minhas Turmas</h2>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
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
                <td>{t.disciplina?.nome}</td>
                <td>{t.periodo}</td>
                <td>{t.matriculas?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
