import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../database";

interface PratoAttributes {
  id: number;
  nome: string;
  cozinha: string;
  descricao_resumida: string;
  descricao_detalhada: string;
  imagem: string | null;
  valor: number;
  categoriaId: number | null;
  disponivel: boolean;
  destaque: boolean;
  ordem: number;
}

interface PratoCreationAttributes
  extends Optional<
    PratoAttributes,
    "id" | "imagem" | "categoriaId" | "disponivel" | "destaque" | "ordem"
  > {}

export class Prato
  extends Model<PratoAttributes, PratoCreationAttributes>
  implements PratoAttributes
{
  declare id: number;
  declare nome: string;
  declare cozinha: string;
  declare descricao_resumida: string;
  declare descricao_detalhada: string;
  declare imagem: string | null;
  declare valor: number;
  declare categoriaId: number | null;
  declare disponivel: boolean;
  declare destaque: boolean;
  declare ordem: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Prato.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    cozinha: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "Cardápio",
    },
    descricao_resumida: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    descricao_detalhada: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imagem: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Categorias",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    disponivel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    destaque: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ordem: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
  },
  {
    sequelize,
    modelName: "Prato",
    tableName: "Pratos",
    timestamps: true,
  }
);

export default Prato;
