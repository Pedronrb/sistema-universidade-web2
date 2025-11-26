import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export interface DisciplinaAttributes {
  id: string;
  nome: string;
  cargaHoraria: number;
}

export interface DisciplinaCreationAttributes
  extends Omit<DisciplinaAttributes, "id"> {}

export class Disciplina
  extends Model<DisciplinaAttributes, DisciplinaCreationAttributes>
  implements DisciplinaAttributes
{
  id!: string;
  nome!: string;
  cargaHoraria!: number;
}

Disciplina.init(
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
    cargaHoraria: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "disciplinas",
  },
);
