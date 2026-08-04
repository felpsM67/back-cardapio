import { DataTypes, Model } from "sequelize";

import sequelize from "@/database";
import Pedido from "@/models/pedido-model";
import Prato from "@/models/prato-model";

export class PedidoItem extends Model {
  declare id: number;
  declare pedidoId: number;
  declare pratoId: number;
  declare quantidade: number;
  declare precoUnitario: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PedidoItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    pedidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Pedidos",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    pratoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Pratos",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },

    precoUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    modelName: "PedidoItem",
    tableName: "PedidoItens",
    timestamps: true,
  }
);

Pedido.hasMany(PedidoItem, {
  foreignKey: "pedidoId",
  as: "itens",
  onDelete: "CASCADE",
});

PedidoItem.belongsTo(Pedido, {
  foreignKey: "pedidoId",
  as: "pedido",
});

PedidoItem.belongsTo(Prato, {
  foreignKey: "pratoId",
  as: "prato",
});

Prato.hasMany(PedidoItem, {
  foreignKey: "pratoId",
  as: "itensPedido",
});

export default PedidoItem;