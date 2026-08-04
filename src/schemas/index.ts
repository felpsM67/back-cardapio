import * as z from "zod";
import { StatusPedido } from "@/enums/status-pedido";
import { PERMISSOES_CARGO } from "@/enums/permissao";

export const createUserSchema = z.object({
  nome: z
    .string({ error: "O nome de usuario é obrigatório" })
    .min(3, { error: "O nome de usuario deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O nome de usuario deve ter no máximo 30 caracteres" }),
  email: z.email({ error: "O email está no formato incorreto" }),
  senha: z
    .string({ error: "A senha é obrigatória" })
    .min(6, { error: "A senha deve ter no minimo 6 caracteres" })
    .max(8, { error: "A senha deve ter no máximo 8 caracteres" }),
  telefone: z
    .string()
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" })
    .optional(),
  role: z.enum(["Gerente", "Funcionario", "Cliente", "Entregador"], {
    error: "A role deve ser Gerente, Funcionario, Cliente ou Entregador",
  }),
});

export const createCategoriaSchema = z.object({
  nome: z
    .string({ error: "O nome da categoria é obrigatório." })
    .min(2, { error: "O nome da categoria deve ter no mínimo 2 caracteres" })
    .max(100, { error: "O nome da categoria deve ter no máximo 100 caracteres" }),
  descricao: z.string().max(500).nullable().optional(),
  imagem: z.string().nullable().optional(),
  ativo: z.boolean().optional(),
  ordem: z.number().int().min(1).optional(),
});

export const updateUserSchema = z.object({
  nome: z
    .string({ error: "O nome de usuario é obrigatório." })
    .min(3, { error: "O nome de usuario deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O nome de usuario deve ter no máximo 30 caracteres" })
    .optional(),
  senha: z
    .string()
    .min(6, { error: "A senha deve ter no minimo 6 caracteres" })
    .max(8, { error: "A senha deve ter no máximo 8 caracteres" })
    .optional(),
  role: z
    .enum(["Gerente", "Funcionario", "Cliente", "Entregador"], {
      error: "A role deve ser Gerente, Funcionario, Cliente ou Entregador",
    })
    .optional(),
});

export const loginSchema = z.object({
  email: z.email({ error: "O email está no formato incorreto" }),
  senha: z
    .string()
    .min(6, { error: "A senha deve ter no minimo 6 caracteres" })
    .max(8, { error: "A senha deve ter no máximo 8 caracteres" }),
});

export const loginResponseSchema = z.object({
  message: z.string(),
  token: z.string(),
  refreshToken: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string({ error: "O refresh token é obrigatório" }),
});
export const statusPedidoSchema = z.enum(StatusPedido, {
  error: `O status deve ser: ${Object.values(StatusPedido).join(", ")}`,
});

export const pedidoItemSchema = z.object({
  pratoId: z
    .number({
      error: "O ID do prato é obrigatório.",
    })
    .int({
      error: "O ID do prato deve ser um número inteiro.",
    })
    .positive({
      error: "O ID do prato deve ser maior que zero.",
    }),

  quantidade: z
    .number({
      error: "A quantidade deve ser um número.",
    })
    .int({
      error: "A quantidade deve ser um número inteiro.",
    })
    .min(1, {
      error: "A quantidade deve ser no mínimo 1.",
    }),

  precoUnitario: z
    .number({
      error: "O preço unitário deve ser um número.",
    })
    .min(0, {
      error: "O preço unitário não pode ser negativo.",
    }),
});

export const createPedidoSchema = z.object({
  clienteTelefone: z
    .string({
      error: "O telefone do cliente é obrigatório.",
    })
    .min(10, {
      error: "O telefone deve ter no mínimo 10 caracteres.",
    })
    .max(15, {
      error: "O telefone deve ter no máximo 15 caracteres.",
    }),

  itens: z
    .array(pedidoItemSchema, {
      error: "Os itens do pedido estão incorretos.",
    })
    .min(1, {
      error: "O pedido deve possuir pelo menos um item.",
    }),
});

export const updatePedidoSchema = z
  .object({
    status: statusPedidoSchema.optional(),

    itens: z
      .array(pedidoItemSchema, {
        error: "Os itens do pedido estão incorretos.",
      })
      .min(1, {
        error: "O pedido deve possuir pelo menos um item.",
      })
      .optional(),
  })
  .refine(
    (dados) => dados.status !== undefined || dados.itens !== undefined,
    {
      message: "Informe o status ou os itens que serão atualizados.",
    }
  );
export const authResponseSchema = z.object({
  token: z.string(),
  userId: z.number(),
  role: z.enum(["Gerente", "Funcionario", "Cliente", "Entregador"]),
});

export const createPratoSchema = z.object({
  nome: z
    .string({ error: "O nome do prato é obrigatório." })
    .min(2, { error: "O nome do prato deve ter no mínimo 2 caracteres" })
    .max(100, { error: "O nome do prato deve ter no máximo 100 caracteres" }),
  cozinha: z.string().min(2).max(50).default("Cardápio"),
  descricao_resumida: z.string().min(1).max(255),
  descricao_detalhada: z.string().min(1).max(2000),
  imagem: z.string().nullable().optional(),
  valor: z.number().min(0, { error: "O preço deve ser no mínimo 0" }),
  categoriaId: z.number().int().positive(),
  disponivel: z.boolean().optional(),
  destaque: z.boolean().optional(),
  ordem: z.number().int().min(1).optional(),
});

export const updatePratoSchema = createPratoSchema.partial();

export const createClienteSchema = z.object({
  nome: z
    .string({ error: "O nome do cliente é obrigatório." })
    .min(3, { error: "O nome do cliente deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O nome do cliente deve ter no máximo 30 caracteres" }),
  telefone: z
    .string({ error: "O telefone é obrigatório." })
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" }),
  endereco: z
    .string({ error: "O endereço é obrigatório." })
    .min(5, { error: "O endereço deve ter no mínimo 5 caracteres" })
    .max(100, { error: "O endereço deve ter no máximo 100 caracteres" }),
  userId: z.number({ error: "O ID do usuário é obrigatório." }),
});

export const createFuncionarioSchema = z.object({
  nome: z
    .string({ error: "O nome do funcionário é obrigatório." })
    .min(3, { error: "O nome do funcionário deve ter no mínimo 3 caracteres" })
    .max(30, {
      error: "O nome do funcionário deve ter no máximo 30 caracteres",
    }),
  telefone: z
    .string({ error: "O telefone é obrigatório." })
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" }),
  cargo: z
    .string({ error: "O cargo é obrigatório." })
    .min(3, { error: "O cargo deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O cargo deve ter no máximo 30 caracteres" }),
  userId: z.number({ error: "O ID do usuário é obrigatório." }),
});

export const createGerenteSchema = z.object({
  nome: z
    .string({ error: "O nome do gerente é obrigatório." })
    .min(3, { error: "O nome do gerente deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O nome do gerente deve ter no máximo 30 caracteres" }),
  telefone: z
    .string({ error: "O telefone é obrigatório." })
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" }),
  departamento: z
    .string({ error: "O departamento é obrigatório." })
    .min(3, { error: "O departamento deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O departamento deve ter no máximo 30 caracteres" }),
  userId: z.number({ error: "O ID do usuário é obrigatório." }),
});

export const updateClienteSchema = z.object({
  nome: z
    .string({ error: "O nome do cliente é obrigatório." })
    .min(3, { error: "O nome do cliente deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O nome do cliente deve ter no máximo 30 caracteres" })
    .optional(),
  telefone: z
    .string({ error: "O telefone é obrigatório." })
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" })
    .optional(),
  endereco: z
    .string({ error: "O endereço é obrigatório." })
    .min(5, { error: "O endereço deve ter no mínimo 5 caracteres" })
    .max(100, { error: "O endereço deve ter no máximo 100 caracteres" })
    .optional(),
});

export const updateFuncionarioSchema = z.object({
  nome: z
    .string({ error: "O nome do funcionário é obrigatório." })
    .min(3, { error: "O nome do funcionário deve ter no mínimo 3 caracteres" })
    .max(30, {
      error: "O nome do funcionário deve ter no máximo 30 caracteres",
    })
    .optional(),
  telefone: z
    .string({ error: "O telefone é obrigatório." })
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" })
    .optional(),
  cargo: z
    .string({ error: "O cargo é obrigatório." })
    .min(3, { error: "O cargo deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O cargo deve ter no máximo 30 caracteres" })
    .optional(),
});

export const updateGerenteSchema = z.object({
  nome: z
    .string({ error: "O nome do gerente é obrigatório." })
    .min(3, { error: "O nome do gerente deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O nome do gerente deve ter no máximo 30 caracteres" })
    .optional(),
  telefone: z
    .string({ error: "O telefone é obrigatório." })
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" })
    .optional(),
  departamento: z
    .string({ error: "O departamento é obrigatório." })
    .min(3, { error: "O departamento deve ter no mínimo 3 caracteres" })
    .max(30, { error: "O departamento deve ter no máximo 30 caracteres" })
    .optional(),
});

export const updateCategoriaSchema = createCategoriaSchema.partial();
export const createAdicionalSchema = z.object({
  nomeAdicional: z
    .string({ error: "O nome do adicional é obrigatório." })
    .min(3, {
      error: "O nome do adicional deve ter no mínimo 3 caracteres",
    })
    .max(50, {
      error: "O nome do adicional deve ter no máximo 50 caracteres",
    }),

  valor: z
    .number({ error: "O valor do adicional deve ser um número" })
    .min(0, {
      error: "O valor do adicional deve ser igual ou maior que 0",
    }),
});

export const updateAdicionalSchema = z.object({
  nomeAdicional: z
    .string({ error: "O nome do adicional está incorreto." })
    .min(3, {
      error: "O nome do adicional deve ter no mínimo 3 caracteres",
    })
    .max(50, {
      error: "O nome do adicional deve ter no máximo 50 caracteres",
    })
    .optional(),

  valor: z
    .number({ error: "O valor do adicional deve ser um número" })
    .min(0, {
      error: "O valor do adicional deve ser igual ou maior que 0",
    })
    .optional(),
});
export const createEntregadorSchema = z.object({
  nome: z
    .string({ error: "O nome do entregador é obrigatório." })
    .min(3, { error: "O nome deve ter no mínimo 3 caracteres" })
    .max(50, { error: "O nome deve ter no máximo 50 caracteres" }),

  telefone: z
    .string({ error: "O telefone é obrigatório." })
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" }),

   placa: z
    .string({ error: "A placa é obrigatória." })
    .min(7, { error: "A placa deve ter no mínimo 7 caracteres" })
    .max(8, { error: "A placa deve ter no máximo 8 caracteres" }),


  userId: z.number({ error: "O ID do usuário é obrigatório." }),

  disponivel: z.boolean().optional(),

  ativo: z.boolean().optional(),
});

export const updateEntregadorSchema = z.object({
  nome: z
    .string()
    .min(3, { error: "O nome deve ter no mínimo 3 caracteres" })
    .max(50, { error: "O nome deve ter no máximo 50 caracteres" })
    .optional(),

  telefone: z
    .string()
    .min(10, { error: "O telefone deve ter no mínimo 10 caracteres" })
    .max(15, { error: "O telefone deve ter no máximo 15 caracteres" })
    .optional(),

  documento: z
    .string()
    .min(11, { error: "O documento deve ter no mínimo 11 caracteres" })
    .max(14, { error: "O documento deve ter no máximo 14 caracteres" })
    .optional(),

  placa: z
    .string()
    .min(7, { error: "A placa deve ter no mínimo 7 caracteres" })
    .max(8, { error: "A placa deve ter no máximo 8 caracteres" })
    .optional(),

  veiculos: z
    .string()
    .min(2, { error: "O veículo deve ter no mínimo 2 caracteres" })
    .max(50, { error: "O veículo deve ter no máximo 50 caracteres" })
    .optional(),


  disponivel: z.boolean().optional(),

  ativo: z.boolean().optional(),
});

export const createConfiguracoesSchema = z.object({
  nomeLoja: z
    .string({ error: "O nome da loja é obrigatório" })
    .min(3, { message: "O nome da loja deve ter no mínimo 3 caracteres" })
    .max(100, { message: "O nome da loja deve ter no máximo 100 caracteres" }),
  numeroLoja: z
    .string({ error: "O número da loja é obrigatório" })
    .min(1, { message: "O número da loja é obrigatório" }),
  chavePix: z
    .string({ error: "A chave Pix é obrigatória" })
    .min(5, { message: "A chave Pix deve ter no mínimo 5 caracteres" }),
  horaAbre: z
    .string({ error: "A hora de abertura é obrigatória" })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)" }),
  horaFecha: z
    .string({ error: "A hora de fechamento é obrigatória" })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)" }),
  prazoEntrega: z
    .string({ error: "O prazo de entrega é obrigatório" })
    .min(1, { message: "O prazo de entrega é obrigatório" }),
  valorFrete: z
    .number({ error: "O valor do frete é obrigatório" })
    .min(0, { message: "O valor do frete não pode ser negativo" }),
  pedidoMinimo: z
    .number({ error: "O valor do pedido mínimo é obrigatório" })
    .min(0, { message: "O valor do pedido mínimo não pode ser negativo" }),
});

export const updateConfiguracoesSchema = z.object({
  nomeLoja: z
    .string({ error: "O nome da loja é obrigatório" })
    .min(3, { message: "O nome da loja deve ter no mínimo 3 caracteres" })
    .max(100, { message: "O nome da loja deve ter no máximo 100 caracteres" })
    .optional(),
  numeroLoja: z
    .string({ error: "O número da loja é obrigatório" })
    .min(1, { message: "O número da loja é obrigatório" })
    .optional(),
  chavePix: z
    .string({ error: "A chave Pix é obrigatória" })
    .min(5, { message: "A chave Pix deve ter no mínimo 5 caracteres" })
    .optional(),
  horaAbre: z
    .string({ error: "A hora de abertura é obrigatória" })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)" })
    .optional(),
  horaFecha: z
    .string({ error: "A hora de fechamento é obrigatória" })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)" })
    .optional(),
  prazoEntrega: z
    .string({ error: "O prazo de entrega é obrigatório" })
    .min(1, { message: "O prazo de entrega é obrigatório" })
    .optional(),
  valorFrete: z
    .number({ error: "O valor do frete é obrigatório" })
    .min(0, { message: "O valor do frete não pode ser negativo" })
    .optional(),
  pedidoMinimo: z
    .number({ error: "O valor do pedido mínimo é obrigatório" })
    .min(0, { message: "O valor do pedido mínimo não pode ser negativo" })
    .optional(),
});
export const createCargoSchema = z.object({
  nome: z
    .string({
      error: "O nome do cargo é obrigatório.",
    })
    .min(2, {
      error: "O nome do cargo deve ter no mínimo 2 caracteres.",
    })
    .max(100, {
      error: "O nome do cargo deve ter no máximo 100 caracteres.",
    }),

  descricao: z
    .string()
    .max(500, {
      error: "A descrição deve ter no máximo 500 caracteres.",
    })
    .nullable()
    .optional(),

  permissoes: z
    .array(
      z.enum(PERMISSOES_CARGO, {
        error: "Uma ou mais permissões são inválidas.",
      }),
    )
    .optional()
    .default([]),

  ativo: z.boolean().optional().default(true),
});

export const updateCargoSchema = createCargoSchema
  .partial()
  .refine(
    (dados) => Object.keys(dados).length > 0,
    {
      message: "Informe pelo menos um campo para atualização.",
    },
  );

export const alterarStatusCargoSchema = z.object({
  ativo: z.boolean({
    error: "O campo ativo deve ser booleano.",
  }),
});