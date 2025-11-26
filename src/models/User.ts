import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import {
  UserAttributes,
  UserCreationAttributes,
  UserType,
} from "./types/UserTypes";

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  id!: string;
  nome!: string;
  email!: string;
  senha!: string;
  tipo!: UserType;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    senha: { type: DataTypes.STRING, allowNull: false },
    tipo: {
      type: DataTypes.ENUM(
        UserType.COORDENADOR,
        UserType.PROFESSOR,
        UserType.ALUNO,
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
  },
);
