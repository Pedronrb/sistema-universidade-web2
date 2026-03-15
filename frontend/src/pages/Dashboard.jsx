import { useState } from "react";
import { getTokenPayload, getUserPapel } from "../utils/auth";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";

// Views por papel
import GerenciarUsuarios from "../components/views/GerenciarUsuarios";
import GerenciarTurmas from "../components/views/GerenciarTurmas";
import GerenciarDisciplinas from "../components/views/GerenciarDisciplinas";
import GerenciarCursos from "../components/views/GerenciarCursos";
import GerenciarPapeis from "../components/views/GerenciarPapeis";
import GerenciarMatriculas from "../components/views/GerenciarMatriculas";
import LancarNotas from "../components/views/LancarNotas";
import RegistrarFrequencia from "../components/views/RegistrarFrequencia";
import MinhasTurmas from "../components/views/MinhasTurmas";
import MinhasNotas from "../components/views/MinhasNotas";
import MinhaFrequencia from "../components/views/MinhaFrequencia";
import MinhasMatriculas from "../components/views/MinhasMatriculas";

import "../styles/Dashboard.css";

const menus = {
  admin: [
    { label: "Gerenciar Usuários", view: "usuarios", icon: "👤" },
    { label: "Gerenciar Cursos", view: "cursos", icon: "🎓" },
    { label: "Gerenciar Papéis", view: "papeis", icon: "🔑" },
  ],
  coordenador: [
    { label: "Gerenciar Turmas", view: "turmas", icon: "🏫" },
    { label: "Matricular Alunos", view: "matriculas", icon: "📋" },
    { label: "Gerenciar Disciplinas", view: "disciplinas", icon: "📚" },
  ],
  professor: [
    { label: "Lançar Notas", view: "lancarNotas", icon: "📝" },
    { label: "Registrar Frequência", view: "frequencia", icon: "✅" },
    { label: "Minhas Turmas", view: "minhasTurmas", icon: "🏫" },
  ],
  aluno: [
    { label: "Minhas Notas", view: "minhasNotas", icon: "📝" },
    { label: "Minha Frequência", view: "minhaFrequencia", icon: "✅" },
    { label: "Minhas Matrículas", view: "minhasMatriculas", icon: "📋" },
  ],
};

const saudacoes = {
  admin: "Painel Administrativo",
  coordenador: "Painel do Coordenador",
  professor: "Painel do Professor",
  aluno: "Painel do Aluno",
};

const titulos = {
  admin: "Administrador",
  coordenador: "Coordenador",
  professor: "Professor",
  aluno: "Aluno",
};

const viewComponents = {
  usuarios: GerenciarUsuarios,
  turmas: GerenciarTurmas,
  disciplinas: GerenciarDisciplinas,
  matriculas: GerenciarMatriculas,
  cursos: GerenciarCursos,
  papeis: GerenciarPapeis,
  lancarNotas: LancarNotas,
  frequencia: RegistrarFrequencia,
  minhasTurmas: MinhasTurmas,
  minhasNotas: MinhasNotas,
  minhaFrequencia: MinhaFrequencia,
  minhasMatriculas: MinhasMatriculas,
};

export default function Dashboard() {
  const [viewAtual, setViewAtual] = useState(null);
  const papel = getUserPapel();
  const payload = getTokenPayload();
  const nomeUsuario = payload?.nome || "Usuário";

  if (!papel || !menus[papel]) {
    return (
      <p className="dashboard-erro">
        Papel não reconhecido. Faça login novamente.
      </p>
    );
  }

  const itens = menus[papel];
  const ViewComponent = viewAtual ? viewComponents[viewAtual] : null;

  return (
    <div className="dashboard-layout">
      <Topbar nomeUsuario={nomeUsuario} />
      <div className="dashboard-body">
        <Sidebar
          itens={itens}
          nomeUsuario={nomeUsuario}
          papel={titulos[papel]}
          viewAtual={viewAtual}
          onNavigate={setViewAtual}
        />
        <main className="dashboard-main">
          {ViewComponent ? (
            <ViewComponent />
          ) : (
            <>
              <h1 className="dashboard-greeting">{saudacoes[papel]}</h1>
              <p className="dashboard-subtitle">
                Selecione uma opção para começar.
              </p>
              <div className="dashboard-grid">
                {itens.map((item, i) => (
                  <Card
                    key={item.label}
                    title={item.label}
                    icon={item.icon}
                    onClick={() => setViewAtual(item.view)}
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
