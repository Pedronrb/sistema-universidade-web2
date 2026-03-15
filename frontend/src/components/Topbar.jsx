export default function Topbar({ nomeUsuario }) {
  const iniciais = nomeUsuario
    ? nomeUsuario
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="topbar">
      <div className="title">SGA — Sistema de Gestão Acadêmica</div>
      <div className="profile">
        <div className="avatar" title={nomeUsuario}>
          {iniciais}
        </div>
      </div>
    </div>
  );
}
