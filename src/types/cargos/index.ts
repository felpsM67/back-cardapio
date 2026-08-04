import { Optional } from "sequelize";
import * as z from "zod";


import type { PermissaoCargo } from "@/enums/permissao";
import {
  createCargoSchema,
  updateCargoSchema,
} from "@/schemas";

export interface CargoAttributes {
  id: number;
  nome: string;
  descricao: string | null;
  permissoes: PermissaoCargo[];
  ativo: boolean;
}

export interface CargoCreationAttributes
  extends Optional<
    CargoAttributes,
    "id" | "descricao" | "permissoes" | "ativo"
  > {}

export type CreateCargoDTO = z.infer<
  typeof createCargoSchema
>;

export type UpdateCargoDTO = z.infer<
  typeof updateCargoSchema
>;