import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface TurmaAttributes {
  id: string;
  nome: string;
  disciplinaId: string;
  professorId: string;
}

export interface TurmaCreationAttributes extends Omit<TurmaAttributes, "id"> {}

export class Turma
  extends Model<TurmaAttributes, TurmaCreationAttributes>
  implements TurmaAttributes
{
  id!: string;
  nome!: string;
  disciplinaId!: string;
  professorId!: string;
}

Turma.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disciplinaId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    professorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "turmas",
  },
);
