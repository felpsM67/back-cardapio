import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/database";

export interface EntregadorAttributes {
  id: number;
  funcionarioId: number;
  documento: string | null;
  veiculo: string;
  placa: string | null;
  disponivel: boolean;
  ativo: boolean;
}

type EntregadorCreationAttributes = Optional<EntregadorAttributes, "id" | "documento" | "placa" | "disponivel" | "ativo">;

export class Entregador extends Model<EntregadorAttributes, EntregadorCreationAttributes> implements EntregadorAttributes {
  declare id: number;
  declare funcionarioId: number;
  declare documento: string | null;
  declare veiculo: string;
  declare placa: string | null;
  declare disponivel: boolean;
  declare ativo: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Entregador.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  funcionarioId: { type: DataTypes.INTEGER, allowNull: false, unique: true, references: { model: "Funcionarios", key: "id" }, onDelete: "CASCADE" },
  documento: { type: DataTypes.STRING(20), allowNull: true, unique: true },
  veiculo: { type: DataTypes.STRING(100), allowNull: false },
  placa: { type: DataTypes.STRING(10), allowNull: true },
  disponivel: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
}, { sequelize, modelName: "Entregador", tableName: "Entregadores", timestamps: true });

export default Entregador;
