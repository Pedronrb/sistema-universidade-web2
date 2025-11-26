-- ================================================
--  SISTEMA ACADÊMICO - SCHEMA SIMPLIFICADO
-- ================================================

-- Caso queira recriar o banco do zero:
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- ================================================
-- 1. USERS
-- ================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin','professor','aluno')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ================================================
-- 2. CURSOS
-- ================================================
CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  descricao TEXT
);

-- ================================================
-- 3. DISCIPLINAS
-- ================================================
CREATE TABLE disciplinas (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  curso_id INT NOT NULL REFERENCES cursos(id)
);

-- ================================================
-- 4. PROFESSORES (ligado ao usuário)
-- ================================================
CREATE TABLE professores (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id)
);

-- ================================================
-- 5. ALUNOS (ligado ao usuário)
-- ================================================
CREATE TABLE alunos (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE NOT NULL REFERENCES users(id),
  matricula VARCHAR(20) UNIQUE NOT NULL
);

-- ================================================
-- 6. MATRÍCULAS (aluno ↔ disciplina)
-- ================================================
CREATE TABLE matriculas (
  id SERIAL PRIMARY KEY,
  aluno_id INT NOT NULL REFERENCES alunos(id),
  disciplina_id INT NOT NULL REFERENCES disciplinas(id),
  UNIQUE (aluno_id, disciplina_id)
);

-- ================================================
-- 7. AULAS DE CADA DISCIPLINA
-- ================================================
CREATE TABLE aulas (
  id SERIAL PRIMARY KEY,
  disciplina_id INT NOT NULL REFERENCES disciplinas(id),
  data DATE NOT NULL,
  conteudo TEXT
);

-- ================================================
-- 8. NOTAS
-- ================================================
CREATE TABLE notas (
  id SERIAL PRIMARY KEY,
  aluno_id INT NOT NULL REFERENCES alunos(id),
  disciplina_id INT NOT NULL REFERENCES disciplinas(id),
  nota NUMERIC(4,2),
  UNIQUE (aluno_id, disciplina_id)
);

-- ================================================
-- INSERÇÃO INICIAL (opcional)
-- ================================================
INSERT INTO users (nome, email, senha, role)
VALUES 
  ('Administrador', 'admin@sistema.com', 'senha_hash', 'admin');

INSERT INTO cursos (nome) VALUES ('Ciência da Computação'), ('Sistemas de Informação');
