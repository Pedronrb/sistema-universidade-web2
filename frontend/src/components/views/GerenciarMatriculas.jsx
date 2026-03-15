import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function GerenciarMatriculas() {
  const [matriculas, setMatriculas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [criando, setCriando] = useState(false);
  const [form, setForm] = useState({ usuarioId: "", turmaId: "" });

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const [m, u, t] = await Promise.all([
        api.get("/matriculas"),
        api.get("/users"),
        api.get("/turmas"),
      ]);
      setMatriculas(m.data || m);
      setUsuarios((u.data || u).filter((u) => u.papeis.includes("aluno")));
      setTurmas(t.data || t);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function criarMatricula(e) {
    e.preventDefault();
    try {
      await api.post("/matriculas", {
        usuarioId: Number(form.usuarioId),
        turmaId: Number(form.turmaId),
      });
      setMsgSucesso("Matrícula realizada com sucesso!");
      setForm({ usuarioId: "", turmaId: "" });
      setCriando(false);
      carregar();
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  async function deletarMatricula(id) {
    if (!confirm("Deseja cancelar esta matrícula?")) return;
    try {
      await api.delete(`/matriculas/${id}`);
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Gerenciar Matrículas</h2>
        <button className="btn-primary" onClick={() => setCriando(!criando)}>
          {criando ? "Cancelar" : "+ Nova Matrícula"}
        </button>
      </div>

      {msgSucesso && <p className="msg-sucesso">{msgSucesso}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      {criando && (
        <form className="view-form" onSubmit={criarMatricula}>
          <select
            value={form.usuarioId}
            onChange={(e) => setForm({ ...form, usuarioId: e.target.value })}
            required
          >
            <option value="">Selecione o aluno</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
          <select
            value={form.turmaId}
            onChange={(e) => setForm({ ...form, turmaId: e.target.value })}
            required
          >
            <option value="">Selecione a turma</option>
            {turmas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.codigo} — {t.disciplina?.nome}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">
            Matricular
          </button>
        </form>
      )}

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <table className="view-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Aluno</th>
              <th>Turma</th>
              <th>Disciplina</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {matriculas.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.usuario?.nome || m.usuarioId}</td>
                <td>{m.turma?.codigo || m.turmaId}</td>
                <td>{m.turma?.disciplina?.nome || "—"}</td>
                <td>
                  <button
                    className="btn-danger-sm"
                    onClick={() => deletarMatricula(m.id)}
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
