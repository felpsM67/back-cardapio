import * as z from 'zod'
import { createCategoriaSchema } from '@/schemas'

export type CreateCategoriaDTO = z.infer<typeof createCategoriaSchema>;