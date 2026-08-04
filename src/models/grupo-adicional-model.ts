import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/database";
interface Attr { id:number; nome:string; obrigatorio:boolean; maxSelecoes:number; ativo:boolean; pratoIds:number[]; adicionalIds:number[]; }
type Creation=Optional<Attr,"id"|"obrigatorio"|"maxSelecoes"|"ativo"|"pratoIds"|"adicionalIds">;
export class GrupoAdicional extends Model<Attr,Creation> implements Attr {
  declare id:number; declare nome:string; declare obrigatorio:boolean; declare maxSelecoes:number; declare ativo:boolean; declare pratoIds:number[]; declare adicionalIds:number[];
  declare readonly createdAt:Date; declare readonly updatedAt:Date;
}
GrupoAdicional.init({
  id:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
  nome:{type:DataTypes.STRING(120),allowNull:false},
  obrigatorio:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue:false},
  maxSelecoes:{type:DataTypes.INTEGER,allowNull:false,defaultValue:1,validate:{min:1}},
  ativo:{type:DataTypes.BOOLEAN,allowNull:false,defaultValue:true},
  pratoIds:{type:DataTypes.JSON,allowNull:false,defaultValue:[]},
  adicionalIds:{type:DataTypes.JSON,allowNull:false,defaultValue:[]},
},{sequelize,modelName:"GrupoAdicional",tableName:"GruposAdicionais",timestamps:true});
export default GrupoAdicional;
