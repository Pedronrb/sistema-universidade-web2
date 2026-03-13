import { useAuth } from "../services/useAuth";

const ROLE_LABELS = {
  ADMIN: "Administrador",
  ALUNO: "Aluno",
  PROFESSOR: "Professor",
  COORDENADOR: "Coordenador"
};

export default function Topbar() {
  const { user } = useAuth();
  const papeis = (user?.papeis || []).map((p) => p.toUpperCase());
  const primaryRole = papeis[0] || "USUÁRIO";
  const displayRole = ROLE_LABELS[primaryRole] || "Usuário";

  return (
    <div className="topbar">
      <div className="title">{displayRole} - SGA</div>

      <div className="profile">
        <div className="avatar"></div>
      </div>
    </div>
  );
}
