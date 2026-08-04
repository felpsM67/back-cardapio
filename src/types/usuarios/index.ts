import * as z from "zod";
import { createUserSchema, updateUserSchema } from "../../schemas";

export type CreateUserDTO = z.infer<typeof createUserSchema>;

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;

export type ResponseCreateUserDto = Partial<CreateUserDTO> & { id: number };
