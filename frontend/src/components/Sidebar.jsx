import { useAuth } from "../services/useAuth";

const ROLE_LABELS = {
  ADMIN: "Administrador",
  ALUNO: "Aluno",
  PROFESSOR: "Professor",
  COORDENADOR: "Coordenador"
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const papeis = (user?.papeis || []).map((p) => p.toUpperCase());
  const primaryRole = papeis[0];

  const menuItems = {
    ADMIN: ["Criar Curso", "Gerenciar Usuários"],
    COORDENADOR: ["Criar Disciplina", "Criar Turma", "Realizar Matrícula"],
    PROFESSOR: ["Lançar Nota", "Registrar Frequência"],
    ALUNO: ["Consultar Notas", "Consultar Frequência", "Consultar Matrículas"]
  };

  // Usa sempre o primeiro papel retornado pelo backend como papel ativo
  const currentRole = menuItems[primaryRole] ? primaryRole : null;
  const links = currentRole ? menuItems[currentRole] : [];
  const displayRole = ROLE_LABELS[currentRole] || "Usuário";

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>SGA - {displayRole}</h3>
      </div>
      <nav>
        <ul>
          {links.map((item, index) => (
            <li key={index}><a href="#">{item}</a></li>
          ))}
        </ul>
      </nav>
      <button onClick={logout} className="logout-btn">Sair</button>
    </aside>
  );
}