# **Relatório Técnico – Sistema de Gerenciamento Acadêmico (SGA)**

## **1. Objetivo**
O presente relatório descreve a modelagem e implementação de um Sistema de Gerenciamento Acadêmico (SGA), com o propósito de organizar e gerenciar informações relacionadas a usuários, cursos, disciplinas, turmas, matrículas, notas e frequências. O sistema visa proporcionar controle eficiente e seguro sobre os dados acadêmicos, permitindo a atuação de diferentes perfis de usuários, como administradores, coordenadores, professores e alunos.

## **2. Descrição do Sistema**

O SGA é uma aplicação do tipo **API REST**, desenvolvida em **Node.js**, utilizando **Express** como framework e **Prisma ORM** para acesso ao banco de dados PostgreSQL. O sistema é modular, organizado em camadas: **Routes → Controller → Service → Repository**, garantindo separação de responsabilidades e facilidade de manutenção.

As funcionalidades principais incluem:

- Gerenciamento de usuários e seus perfis;
- Cadastro e manutenção de cursos e disciplinas;
- Criação e gestão de turmas, vinculando disciplinas e professores;
- Matrícula de alunos em turmas;
- Registro de notas e frequências por matrícula;
- Controle de acesso baseado em papéis de usuário.

## **3. Modelagem de Dados**

- Modelagem
    
    ```java
    @startuml
    
    title Modelo Genérico do Sistema de Gerenciamento Acadêmico (SGA)
    
    ' === USUÁRIOS E PERFIS ===
    class Usuario {
      +id: int
      +nome: string
      +email: string
      +senha: string
    }
    
    class Papel {
      +id: int
      +nome: string <<admin, coordenador, professor, aluno>>
    }
    
    class UsuarioPapel {
      +usuarioId: int
      +papelId: int
    }
    
    ' === ENTIDADES ACADÊMICAS ===
    class Curso {
      +id: int
      +nome: string
      +descricao: string
    }
    
    class Disciplina {
      +id: int
      +nome: string
      +codigo: string
      +cargaHoraria: int
      +cursoId: int
    }
    
    class Turma {
      +id: int
      +codigo: string
      +disciplinaId: int
      +professorId: int
      +periodo: string
    }
    
    class Matricula {
      +id: int
      +usuarioId: int
      +turmaId: int
    }
    
    class Nota {
      +id: int
      +matriculaId: int
      +valor: float
      +etapa: string
    }
    
    class Frequencia {
      +id: int
      +matriculaId: int
      +data: date
      +presente: boolean
    }
    
    ' === RELACIONAMENTOS ===
    Usuario --> UsuarioPapel : possui >
    Papel --> UsuarioPapel : define >
    
    Curso --> Disciplina : contém >
    Disciplina --> Turma : oferta >
    Usuario --> Turma : ministra >
    Turma --> Matricula : possui >
    Usuario --> Matricula : realiza >
    
    Matricula --> Nota
    Matricula --> Frequencia
    
    @enduml
    
    ```
  - View
  <img width="746" height="907" alt="image" src="https://github.com/user-attachments/assets/fc31b096-a385-4098-9b3c-287aa0376baa" />

A modelagem segue uma estrutura **relacional**, organizada em entidades e relacionamentos claros:

### **Entidades Principais**

- **Usuario:** Representa pessoas no sistema, incluindo alunos, professores, coordenadores e administradores. Campos: `id`, `nome`, `email` e `senha`.
- **Papel:** Define o perfil de cada usuário, como `admin`, `coordenador`, `professor` ou `aluno`.
- **UsuarioPapel:** Tabela associativa que implementa o relacionamento **many-to-many** entre `Usuario` e `Papel`.
- **Curso:** Representa cursos acadêmicos. Campos: `id`, `nome` e `descricao`.
- **Disciplina:** Pertence a um curso e representa uma matéria. Campos: `id`, `nome`, `codigo`, `cargaHoraria` e `cursoId`.
- **Turma:** Associa disciplina e professor, possuindo um período de oferta. Campos: `id`, `codigo`, `disciplinaId`, `professorId` e `periodo`.
- **Matricula:** Liga alunos às turmas. Campos: `id`, `usuarioId`, `turmaId`.
- **Nota:** Associada a uma matrícula, registra o desempenho do aluno em etapas. Campos: `id`, `matriculaId`, `valor`, `etapa`.
- **Frequencia:** Também vinculada à matrícula, registra presença ou ausência do aluno. Campos: `id`, `matriculaId`, `data`, `presente`.

### **Relacionamentos Principais**

- **Curso → Disciplina:** Um curso contém várias disciplinas.
- **Disciplina → Turma:** Cada disciplina pode ter várias turmas.
- **Usuario → Turma:** Professores ministram turmas.
- **Turma → Matricula:** Cada turma possui várias matrículas.
- **Usuario → Matricula:** Alunos realizam matrículas.
- **Matricula → Nota/Frequencia:** Cada matrícula registra notas e presenças.
- **Usuario → UsuarioPapel → Papel:** Define os papéis de cada usuário, permitindo múltiplos perfis por pessoa.

## **4. Implementação Técnica**

- **Linguagem:** JavaScript (ES Modules)
- **Backend:** Node.js + Express
- **Banco de Dados:** PostgreSQL via Docker
- **ORM:** Prisma 4.16.2
- **Estrutura de Módulos:**
    - **Routes:** Define endpoints da API
    - **Controller:** Recebe requisições e trata respostas
    - **Service:** Contém lógica de negócio
    - **Repository:** Abstrai operações com o banco via Prisma

O sistema segue práticas de segurança básica, como **hash de senhas com bcryptjs** e validação de dados no nível do serviço.

## **5. Funcionalidades Testadas**

- Criação, listagem e consulta de usuários;
- Criação de cursos, disciplinas e turmas;
- Matrícula de alunos e associação com notas e frequências;
- Visualização de dados via Prisma Studio;
- Testes de endpoints via Postman, garantindo respostas esperadas.

## **6. Conclusão**

O Sistema de Gerenciamento Acadêmico (SGA) apresenta uma **arquitetura modular e escalável**, permitindo fácil manutenção e evolução. A modelagem relacional adotada garante integridade dos dados e clareza nos relacionamentos acadêmicos. O sistema atende aos requisitos propostos, permitindo gestão eficiente de usuários, cursos, disciplinas, turmas, matrículas, notas e frequências, com controle de acesso baseado em papéis de usuário.
