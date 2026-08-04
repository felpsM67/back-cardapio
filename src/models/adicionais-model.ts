import {  DataTypes, Model } from "sequelize";
import sequelize from "@/database";

export class Adicionais extends Model {
    id!: number;
    nomeAdicional!: string;
    valor!: number;
}

Adicionais.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nomeAdicional: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        valor: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
            min: 0,
            },
        }
    },
    {
        sequelize,
        modelName: "Adicionais",
    }
);

export default Adicionais