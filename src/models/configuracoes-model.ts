import { DataTypes, Model } from "sequelize";
import sequelize from "@/database";

export class Configuracoes extends Model {
    id!: number;
    nomeLoja!: string;
    numeroLoja!: string;
    chavePix!: string;
    horaAbre!: string;
    horaFecha!: string;
    prazoEntrega!: string;
    valorFrete!: number;
    pedidoMinimo!: number;
}

Configuracoes.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nomeLoja: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        numeroLoja: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        chavePix: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        horaAbre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        horaFecha: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prazoEntrega: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        valorFrete: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        pedidoMinimo: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Configuracoes",
    }
);

export default Configuracoes;
