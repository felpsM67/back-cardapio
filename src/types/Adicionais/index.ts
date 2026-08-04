import * as z from "zod";
import { createAdicionalSchema } from "../../schemas";

export type CreateAdicionalDTO = z.infer<typeof createAdicionalSchema>;
