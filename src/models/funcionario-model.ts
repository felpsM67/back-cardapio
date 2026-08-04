import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/database";

export interface FuncionarioAttributes {
  id: number;
  nome: string;
  telefone: string | null;
  ativo: boolean;
  userId: number;
  cargoId: number;
}

type FuncionarioCreationAttributes = Optional<FuncionarioAttributes, "id" | "telefone" | "ativo">;

export class Funcionario extends Model<FuncionarioAttributes, FuncionarioCreationAttributes> implements FuncionarioAttributes {
  declare id: number;
  declare nome: string;
  declare telefone: string | null;
  declare ativo: boolean;
  declare userId: number;
  declare cargoId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Funcionario.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING(100), allowNull: false },
  telefone: { type: DataTypes.STRING(20), allowNull: true },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: "Users", key: "id" }, onDelete: "CASCADE" },
  cargoId: { type: DataTypes.INTEGER, allowNull: false, references: { model: "Cargos", key: "id" }, onDelete: "RESTRICT" },
}, { sequelize, modelName: "Funcionario", tableName: "Funcionarios", timestamps: true });

export default Funcionario;
