import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

export default function MinhasNotas() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const payload = getTokenPayload();

  useEffect(() => {
    async function carregar() {
      try {
        // 1. Busca todas as matrículas e filtra as do aluno logado
        const matriculasData = await api.get("/matriculas");
        const minhasMatriculas = (matriculasData.data || matriculasData).filter(
          (m) => m.usuarioId === payload?.id,
        );

        // 2. Para cada matrícula, busca as notas
        const todasNotas = await Promise.all(
          minhasMatriculas.map((m) =>
            api
              .get(`/notas/matricula/${m.id}`)
              .then((d) => (d.data || d).map((n) => ({ ...n, matricula: m })))
              .catch(() => []),
          ),
        );

        setNotas(todasNotas.flat());
      } catch (e) {
        setErro(e.message);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, []);

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Minhas Notas</h2>
      </div>
      {erro && <p className="msg-erro">{erro}</p>}
      {loading ? (
        <p>Carregando...</p>
      ) : notas.length === 0 ? (
        <p style={{ color: "#777", fontSize: 13 }}>Nenhuma nota registrada.</p>
      ) : (
        <table className="view-table">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Turma</th>
              <th>Etapa</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {notas.map((n) => (
              <tr key={n.id}>
                <td>{n.matricula?.turma?.disciplina?.nome || "—"}</td>
                <td>{n.matricula?.turma?.codigo || "—"}</td>
                <td>{n.etapa}</td>
                <td>
                  <strong>{n.valor}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
