import { DataTypes, Model } from "sequelize";
import sequelize from "@/database";

export class Configuracoes extends Model {
  declare id: number;
  declare nomeLoja: string;
  declare descricao: string;
  declare numeroLoja: string;
  declare chavePix: string;
  declare titularPix: string;
  declare valorFrete: number;
  declare pedidoMinimo: number | null;
  declare slugCardapio: string;
  declare prazoEntrega: string;
  declare horarioFuncionamento: string;
  declare aberto: boolean;
  declare corPrimaria: string;
  declare capaUrl: null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Configuracoes.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nomeLoja: { type: DataTypes.STRING(120), allowNull: false, defaultValue: "Minha Loja" },
    descricao: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    numeroLoja: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "" },
    chavePix: { type: DataTypes.STRING(150), allowNull: false, defaultValue: "" },
    titularPix: { type: DataTypes.STRING(120), allowNull: false, defaultValue: "" },
    valorFrete: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    pedidoMinimo: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    slugCardapio: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "cardapio" },
    prazoEntrega: { type: DataTypes.STRING(80), allowNull: false, defaultValue: "30-45 min" },
    horarioFuncionamento: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "Todos os dias",
    },
    aberto: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    corPrimaria: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "#ea580c" },
    capaUrl: {
  type: DataTypes.TEXT("long"),
  allowNull: true,

},
  },
  {
    sequelize,
    modelName: "Configuracao",
    tableName: "Configuracoes",
    timestamps: true,
  },
);

export default Configuracoes;
