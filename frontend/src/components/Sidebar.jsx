import { logout } from "../utils/auth";

export default function Sidebar({
  itens,
  nomeUsuario,
  papel,
  viewAtual,
  onNavigate,
}) {
  const iniciais = nomeUsuario
    ? nomeUsuario
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <div className="sidebar">
      <div className="sidebar-user">
        <div className="sidebar-avatar">{iniciais}</div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{nomeUsuario}</span>
          <span className="sidebar-user-role">{papel}</span>
        </div>
      </div>

      {itens.map((item) => (
        <div
          key={item.label}
          className={`menu-item ${viewAtual === item.view ? "menu-item-ativo" : ""}`}
          onClick={() => onNavigate(item.view)}
        >
          <span>{item.icon}</span>
          {item.label}
        </div>
      ))}

      <button className="sidebar-logout" onClick={logout}>
        Sair
      </button>
    </div>
  );
}
