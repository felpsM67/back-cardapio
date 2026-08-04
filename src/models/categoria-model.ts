import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/database";

interface CategoriaAttributes {
  id: number;
  nome: string;
  descricao: string | null;
  imagem: string | null;
  ativo: boolean;
  ordem: number;
}

interface CategoriaCreationAttributes
  extends Optional<
    CategoriaAttributes,
    "id" | "descricao" | "imagem" | "ativo" | "ordem"
  > {}

export class Categorias
  extends Model<CategoriaAttributes, CategoriaCreationAttributes>
  implements CategoriaAttributes
{
  declare id: number;
  declare nome: string;
  declare descricao: string | null;
  declare imagem: string | null;
  declare ativo: boolean;
  declare ordem: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Categorias.init(
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
    imagem: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: "Categoria",
    tableName: "Categorias",
    timestamps: true,
  }
);

export default Categorias;
