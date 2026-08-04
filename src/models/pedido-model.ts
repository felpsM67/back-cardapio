import { DataTypes, Model } from "sequelize";

import sequelize from "@/database";
import { StatusPedido } from "@/enums/status-pedido";
import Cliente from "@/models/cliente-model";

export class Pedido extends Model {
  declare id: number;
  declare codigo: string;
  declare clienteId: number;
  declare total: number;
  declare status: StatusPedido;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Pedido.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    codigo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    clienteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Clientes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },

    status: {
      type: DataTypes.ENUM(...Object.values(StatusPedido)),
      allowNull: false,
      defaultValue: StatusPedido.CRIADO,
    },
  },
  {
    sequelize,
    modelName: "Pedido",
    tableName: "Pedidos",
    timestamps: true,
  }
);

Pedido.belongsTo(Cliente, {
  foreignKey: "clienteId",
  as: "cliente",
});

Cliente.hasMany(Pedido, {
  foreignKey: "clienteId",
  as: "pedidos",
});

export default Pedido;