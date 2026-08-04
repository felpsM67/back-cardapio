import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/database";

export interface CargoAttributes {
  id: number;
  nome: string;
  descricao: string | null;
  permissoes: string[];
  ativo: boolean;
}

type CargoCreationAttributes = Optional<CargoAttributes, "id" | "descricao" | "permissoes" | "ativo">;

export class Cargo extends Model<CargoAttributes, CargoCreationAttributes> implements CargoAttributes {
  declare id: number;
  declare nome: string;
  declare descricao: string | null;
  declare permissoes: string[];
  declare ativo: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Cargo.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  descricao: { type: DataTypes.TEXT, allowNull: true },
  permissoes: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { sequelize, modelName: "Cargo", tableName: "Cargos", timestamps: true });

export default Cargo;
