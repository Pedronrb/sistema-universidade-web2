export interface User {
  id?: number;
  nome: string;
  email: string;
  senha: string;
  role: "admin" | "professor" | "aluno";
}
