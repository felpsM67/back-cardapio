import * as z from "zod";
import {
    updateEntregadorSchema,
    createEntregadorSchema
} from "../../schemas"

export type CreateEntregadorDTO = z.infer<
  typeof createEntregadorSchema
>;

export type UpdateEntregadorDTO = z.infer<
  typeof updateEntregadorSchema
>;