import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { getTokenPayload } from "../../utils/auth";

export default function MinhaFrequencia() {
  const [frequencias, setFrequencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const payload = getTokenPayload();

  useEffect(() => {
    async function carregar() {
      try {
        const matriculasData = await api.get("/matriculas");
        const minhasMatriculas = (matriculasData.data || matriculasData).filter(
          (m) => m.usuarioId === payload?.id,
        );

        const todasFrequencias = await Promise.all(
          minhasMatriculas.map((m) =>
            api
              .get(`/frequencias/matricula/${m.id}`)
              .then((d) => (d.data || d).map((f) => ({ ...f, matricula: m })))
              .catch(() => []),
          ),
        );

        setFrequencias(todasFrequencias.flat());
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
        <h2>Minha Frequência</h2>
      </div>
      {erro && <p className="msg-erro">{erro}</p>}
      {loading ? (
        <p>Carregando...</p>
      ) : frequencias.length === 0 ? (
        <p style={{ color: "#777", fontSize: 13 }}>
          Nenhuma frequência registrada.
        </p>
      ) : (
        <table className="view-table">
          <thead>
            <tr>
              <th>Disciplina</th>
              <th>Turma</th>
              <th>Data</th>
              <th>Presença</th>
            </tr>
          </thead>
          <tbody>
            {frequencias.map((f) => (
              <tr key={f.id}>
                <td>{f.matricula?.turma?.disciplina?.nome || "—"}</td>
                <td>{f.matricula?.turma?.codigo || "—"}</td>
                <td>{new Date(f.data).toLocaleDateString("pt-BR")}</td>
                <td>{f.presente ? "✅ Presente" : "❌ Falta"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
