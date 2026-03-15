import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function GerenciarPapeis() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [msgSucesso, setMsgSucesso] = useState("");
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null); // id do usuário sendo editado

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    const termo = busca.toLowerCase();
    setFiltrados(
      usuarios.filter(
        (u) =>
          u.nome.toLowerCase().includes(termo) ||
          u.email.toLowerCase().includes(termo),
      ),
    );
  }, [busca, usuarios]);

  async function carregar() {
    try {
      const data = await api.get("/users");
      const lista = (data.data || data).filter(
        (u) =>
          u.papeis.includes("professor") || u.papeis.includes("coordenador"),
      );
      setUsuarios(lista);
      setFiltrados(lista);
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function alterarPapel(usuario) {
    const papelAtual = usuario.papeis[0];
    const novoPapel = papelAtual === "professor" ? "coordenador" : "professor";

    if (
      !confirm(
        `Deseja alterar o papel de "${usuario.nome}" de ${papelAtual} para ${novoPapel}?`,
      )
    )
      return;

    try {
      await api.patch(`/users/${usuario.id}`, { papel: novoPapel });
      setMsgSucesso(
        `Papel de ${usuario.nome} alterado para ${novoPapel} com sucesso!`,
      );
      setEditando(null);
      carregar();
      setTimeout(() => setMsgSucesso(""), 3000);
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <h2>Gerenciar Papéis</h2>
      </div>

      {msgSucesso && <p className="msg-sucesso">{msgSucesso}</p>}
      {erro && <p className="msg-erro">{erro}</p>}

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Buscar por nome ou email..."
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
            color: "#333",
          }}
        />
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : filtrados.length === 0 ? (
        <p style={{ color: "#777", fontSize: 13 }}>
          Nenhum usuário encontrado.
        </p>
      ) : (
        <table className="view-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Papel Atual</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((u) => (
              <tr key={u.id}>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge">{u.papeis[0]}</span>
                </td>
                <td>
                  <button
                    className="btn-primary"
                    style={{ fontSize: 12, padding: "4px 10px" }}
                    onClick={() => alterarPapel(u)}
                  >
                    {u.papeis[0] === "professor"
                      ? "Promover a Coordenador"
                      : "Rebaixar a Professor"}
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
