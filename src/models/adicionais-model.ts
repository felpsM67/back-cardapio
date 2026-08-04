import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/database";

interface AdicionalAttributes {
  id: number;
  nomeAdicional: string;
  valor: number;
  disponivel: boolean;
}

type AdicionalCreationAttributes = Optional<
  AdicionalAttributes,
  "id" | "disponivel"
>;

export class Adicionais
  extends Model<AdicionalAttributes, AdicionalCreationAttributes>
  implements AdicionalAttributes
{
  declare id: number;
  declare nomeAdicional: string;
  declare valor: number;
  declare disponivel: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Adicionais.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nomeAdicional: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    disponivel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Adicional",
    tableName: "Adicionais",
    timestamps: true,
  },
);

export default Adicionais;