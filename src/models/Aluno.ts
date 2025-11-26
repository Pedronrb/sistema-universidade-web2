import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface AlunoAttributes {
  id: string;
  matricula: string;
  userId: string;
}

export interface AlunoCreationAttributes extends Omit<AlunoAttributes, "id"> {}

export class Aluno
  extends Model<AlunoAttributes, AlunoCreationAttributes>
  implements AlunoAttributes
{
  id!: string;
  matricula!: string;
  userId!: string;
}

Aluno.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    matricula: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "alunos",
  },
);
