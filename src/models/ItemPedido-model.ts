import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/database";
interface Attr { id:number; pedidoId:number; pratoId:number; quantidade:number; precoUnitario:number; observacao:string; adicionais:unknown[]; }
type Creation=Optional<Attr,"id"|"observacao"|"adicionais">;
export class PedidoItem extends Model<Attr,Creation> implements Attr { declare id:number; declare pedidoId:number; declare pratoId:number; declare quantidade:number; declare precoUnitario:number; declare observacao:string; declare adicionais:unknown[]; declare readonly createdAt:Date; declare readonly updatedAt:Date; }
PedidoItem.init({ id:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true}, pedidoId:{type:DataTypes.INTEGER,allowNull:false,references:{model:"Pedidos",key:"id"},onDelete:"CASCADE"}, pratoId:{type:DataTypes.INTEGER,allowNull:false,references:{model:"Pratos",key:"id"},onDelete:"RESTRICT"}, quantidade:{type:DataTypes.INTEGER,allowNull:false,validate:{min:1}}, precoUnitario:{type:DataTypes.DECIMAL(10,2),allowNull:false,validate:{min:0}}, observacao:{type:DataTypes.TEXT,allowNull:false,defaultValue:""}, adicionais:{type:DataTypes.JSON,allowNull:false,defaultValue:[]} }, {sequelize,modelName:"PedidoItem",tableName:"PedidoItens",timestamps:true});
export default PedidoItem;
