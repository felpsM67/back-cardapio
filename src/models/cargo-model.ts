import { DataTypes, Model } from "sequelize";

import sequelize from "@/database";
import type { PermissaoCargo } from "@/enums/permissao";
import type {
  CargoAttributes,
  CargoCreationAttributes,
} from "@/types/cargos";

export class Cargo
  extends Model<
    CargoAttributes,
    CargoCreationAttributes
  >
  implements CargoAttributes
{
  declare id: number;
  declare nome: string;
  declare descricao: string | null;
  declare permissoes: PermissaoCargo[];
  declare ativo: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Cargo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    permissoes: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },

    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "Cargo",
    tableName: "Cargos",
    timestamps: true,

    indexes: [
      {
        unique: true,
        fields: ["nome"],
        name: "cargo_nome_unique",
      },
      {
        fields: ["ativo"],
        name: "cargo_ativo_index",
      },
    ],
  },
);

export default Cargo;