import User from "./user-model";
import Cargo from "./cargo-model";
import Funcionario from "./funcionario-model";
import Entregador from "./entregador-model";
import Pedido from "./pedido-model";
import PedidoItem from "./ItemPedido-model";
import Prato from "./prato-model";
import Categorias from "./categoria-model";
let configured=false;
export function configureAppAssociations():void { if(configured)return;
 User.hasOne(Funcionario,{foreignKey:"userId",as:"funcionario"}); Funcionario.belongsTo(User,{foreignKey:"userId",as:"user"});
 Cargo.hasMany(Funcionario,{foreignKey:"cargoId",as:"funcionarios"}); Funcionario.belongsTo(Cargo,{foreignKey:"cargoId",as:"cargo"});
 Funcionario.hasOne(Entregador,{foreignKey:"funcionarioId",as:"entregador"}); Entregador.belongsTo(Funcionario,{foreignKey:"funcionarioId",as:"funcionario"});
 Categorias.hasMany(Prato,{foreignKey:"categoriaId",as:"pratos"}); Prato.belongsTo(Categorias,{foreignKey:"categoriaId",as:"categoria"});
 Pedido.hasMany(PedidoItem,{foreignKey:"pedidoId",as:"itens",onDelete:"CASCADE"}); PedidoItem.belongsTo(Pedido,{foreignKey:"pedidoId",as:"pedido"});
 Prato.hasMany(PedidoItem,{foreignKey:"pratoId",as:"itensPedido"}); PedidoItem.belongsTo(Prato,{foreignKey:"pratoId",as:"prato"});
 configured=true; }
