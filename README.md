# SGA — Sistema de Gestão Acadêmica

## Pré-requisitos

- Node.js
- Docker e Docker Compose
- npm

---

## Como rodar o projeto

### Backend

1. Suba o banco de dados com Docker:
```bash
   docker compose up -d
```

2. Instale as dependências (apenas na primeira vez):
```bash
   npm install
```

3. Execute as migrations do Prisma:
```bash
   npx prisma migrate dev
```

4. Inicie o servidor:
```bash
   npm run dev
```

O backend estará disponível em `http://localhost:3000`.

---

### Frontend

1. Acesse a pasta do frontend:
```bash
   cd frontend
```

2. Instale as dependências (apenas na primeira vez):
```bash
   npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
   npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## Usuários padrão (seed)

Após rodar as migrations, execute o seed para popular o banco com dados iniciais:
```bash
npx prisma db seed
```

| Email | Senha | Papel |
|---|---|---|
| admin@uni.com | 123456 | Admin |
| coord@uni.com | 123456 | Coordenador |
| prof1@uni.com | 123456 | Professor |
| prof2@uni.com | 123456 | Professor |
| aluno1@uni.com | 123456 | Aluno |

# sistema-universidade-web2
Projeto da disciplina Web 2 - Sistema de gerenciamento com papéis de Coordenador, Professor e Aluno
<img width="854" height="1228" alt="Diagrama sistema gerenciamento" src="https://github.com/user-attachments/assets/ec7b92c0-f122-4d48-b897-923d9adebd0a" />
