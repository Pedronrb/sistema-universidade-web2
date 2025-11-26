export enum UserType {
  COORDENADOR = "coordenador",
  PROFESSOR = "professor",
  ALUNO = "aluno",
}

export interface UserAttributes {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: UserType;
}

export interface UserCreationAttributes extends Omit<UserAttributes, "id"> {}
