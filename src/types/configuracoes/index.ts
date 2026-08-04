import * as z from "zod";
import  { createConfiguracoesSchema, updateConfiguracoesSchema } from "@/schemas";

export type CreateConfiguracoesDTO = z.infer<typeof createConfiguracoesSchema>;
export type UpdateConfiguracoesDTO = z.infer<typeof updateConfiguracoesSchema>;
