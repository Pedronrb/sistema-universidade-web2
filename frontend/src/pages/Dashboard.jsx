import { useAuth } from "../services/useAuth";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AdminPanel from "./AdminPanel";
import AlunoPanel from "./AlunoPanel";
import ProfessorPanel from "./ProfessorPanel";
import CoordenadorPanel from "./CoordenadorPanel";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  // Garante que o backend controla a ordem de prioridade de papéis
  const papeis = (user.papeis || []).map(p => p.toUpperCase());
  const primaryRole = papeis[0]; // primeiro papel do usuário

  const PANELS = {
    ADMIN: <AdminPanel />,
    ALUNO: <AlunoPanel />,
    PROFESSOR: <ProfessorPanel />,
    COORDENADOR: <CoordenadorPanel />
  };

  const activeRole = PANELS[primaryRole] ? primaryRole : null;

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main">
        <Topbar />
        <div className="content">
          {activeRole ? PANELS[activeRole] : <h2>Papel não identificado</h2>}
        </div>
      </div>
    </div>
  );
}