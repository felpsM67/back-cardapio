// tests/integration/create-user.controller.int.spec.ts
import { api } from "../helpers/api";
import { seedUserAndLogin } from "../helpers/auth";
import { closeDb, resetDb, syncDb } from "../helpers/db";

describe("CreateUserController (integration)", () => {
  let token: string;

  beforeAll(async () => {
    await syncDb();
  });

  beforeEach(async () => {
    await resetDb();
    const auth = await seedUserAndLogin(); // cria user+perfil e loga
    token = auth.token;
  });

  afterAll(async () => {
    await closeDb();
  });

  it("deve criar um usuário com sucesso", async () => {
    const resp = await api().withAuth(api().post("/api/users"), token).send({
      nome: "John Doe",
      email: "jhondoe123@dominio.com",
      senha: "senha123",
      role: "Gerente",
    });

    expect(resp.status).toBe(201); // se sua API retorna 201
    expect(resp.type).toMatch(/json/);
    expect(resp.body).toHaveProperty("id");
    expect(resp.body).toMatchObject({
      nome: "John Doe",
      email: "jhondoe123@dominio.com",
      role: "Gerente",
    });
  });

  it("não deve criar usuário sem autenticação", async () => {
    const resp = await api().post("/api/users").send({
      nome: "John Doe",
      email: "jhondoe123@dominio.com",
      senha: "senha123",
      role: "Gerente",
    });
    expect(resp.status).toBe(401);
    expect(resp.type).toMatch(/json/);
    expect(resp.body).toEqual({
      message: "Credenciais ausentes ou inválidas",
    });
  });

  it("não deve criar usuário com dados inválidos", async () => {
    // ARRANGE
    const dadosInvalidos = {
      nome: "Jo", // muito curto
      email: "emailinvalido", // formato inválido
      senha: "123", // muito curto
      role: "Administrador", // valor inválido
    };
    // ACT
    const resp = await api()
      .withAuth(api().post("/api/users"), token)
      .send(dadosInvalidos);
    // ASSERT
    expect(resp.status).toBe(400);
    expect(resp.type).toMatch(/json/);
    expect(resp.body).toEqual({
      errors: [
        {
          message: "O nome de usuario deve ter no mínimo 3 caracteres",
          path: "nome",
        },
        { message: "O email está no formato incorreto", path: "email" },
        { message: "A senha deve ter no minimo 6 caracteres", path: "senha" },
        {
          message: "A role deve ser 'Gerente', 'Funcionario' ou 'Cliente'",
          path: "role",
        },
      ],
      message: "Validation error",
    });
  });

  it("não deve criar usuário sem dados obrigatórios", async () => {
    const dadosFaltando = {}; // nenhum campo fornecido
    const resp = await api()
      .withAuth(api().post("/api/users"), token)
      .send(dadosFaltando);
    expect(resp.status).toBe(400);
    expect(resp.type).toMatch(/json/);
    expect(resp.body).toEqual({
      errors: [
        { message: "O nome de usuario é obrigatório", path: "nome" },
        { message: "O email está no formato incorreto", path: "email" },
        { message: "A senha é obrigatória", path: "senha" },
        {
          message: "A role deve ser 'Gerente', 'Funcionario' ou 'Cliente'",
          path: "role",
        },
      ],
      message: "Validation error",
    });
  });

  it("não deve criar usuário com email já existente", async () => {
    // 1ª criação
    const first = await api().withAuth(api().post("/api/users"), token).send({
      nome: "Jane Doe",
      email: "jhondoe123@dominio.com",
      senha: "senha123",
      role: "Gerente",
    });
    expect(first.status).toBe(201);

    // 2ª criação (duplicada)
    const dup = await api().withAuth(api().post("/api/users"), token).send({
      nome: "Outra Pessoa",
      email: "jhondoe123@dominio.com",
      senha: "senha123",
      role: "Gerente",
    });

    expect(dup.status).toBe(400);
    expect(dup.type).toMatch(/json/);
    expect(dup.body).toEqual({
      message: "Verifique o seguinte parâmetro inválido: email",
      name: "InvalidParamError",
    });
  });
});
