import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/database";

interface Attr {
  id: number;
  titulo: string;
  descricao: string;
  imagem: string | null;
  produtoIds: number[];
  precosPromocionais: Record<string, number>;
  ativo: boolean;
  clicavel: boolean;
  selo: string;
  inicio: Date | null;
  fim: Date | null;
  ordem: number;
}

type Creation = Optional<
  Attr,
  "id" | "descricao" | "imagem" | "produtoIds" | "precosPromocionais" | "ativo" | "clicavel" | "selo" | "inicio" | "fim" | "ordem"
>;

export class Promocao extends Model<Attr, Creation> implements Attr {
  declare id: number;
  declare titulo: string;
  declare descricao: string;
  declare imagem: string | null;
  declare produtoIds: number[];
  declare precosPromocionais: Record<string, number>;
  declare ativo: boolean;
  declare clicavel: boolean;
  declare selo: string;
  declare inicio: Date | null;
  declare fim: Date | null;
  declare ordem: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Promocao.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titulo: { type: DataTypes.STRING(150), allowNull: false },
    descricao: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    imagem: {
  type: DataTypes.TEXT("long"),
  allowNull: true,
},
    produtoIds: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    precosPromocionais: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    clicavel: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    selo: { type: DataTypes.STRING(60), allowNull: false, defaultValue: "Oferta" },
    inicio: { type: DataTypes.DATE, allowNull: true },
    fim: { type: DataTypes.DATE, allowNull: true },
    ordem: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  },
  {
    sequelize,
    modelName: "Promocao",
    tableName: "Promocoes",
    timestamps: true,
  },
);

export default Promocao;
