'use strict';
process.env.NODE_ENV = 'development';
process.env.SWAGGER_ENABLED = 'false';
process.env.UPDATE_MODEL = 'false';
process.env.JWT_SECRET = '0123456789abcdef0123456789abcdef';
process.env.JWT_REFRESH_SECRET = 'abcdef0123456789abcdef0123456789';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.DB_DIALECT = 'mysql';
process.env.DB_HOST = '127.0.0.1';
process.env.DB_PORT = '3306';
process.env.DB_DATABASE = 'unused_test_db';
process.env.DB_USERNAME = 'unused';
process.env.DB_PASSWORD = 'unused';

const assert = require('node:assert/strict');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function entity(obj) {
  return {
    ...obj,
    async update(values) { Object.assign(this, values); return this; },
    async destroy() { this.__deleted = true; },
    toJSON() { const { update, destroy, toJSON, ...rest } = this; return rest; },
  };
}

(async () => {
  const Cargo = require('../src/models/cargo-model').default;
  const Funcionario = require('../src/models/funcionario-model').default;
  const Entregador = require('../src/models/entregador-model').default;
  const Adicional = require('../src/models/adicionais-model').default;
  const Grupo = require('../src/models/grupo-adicional-model').default;
  const Promocao = require('../src/models/promocao-model').default;
  const Configuracoes = require('../src/models/configuracoes-model').default;
  const Pedido = require('../src/models/pedido-model').default;
  const Categoria = require('../src/models/categoria-model').default;
  const Prato = require('../src/models/prato-model').default;
  const User = require('../src/models/user-model').default;

  const cargoService = require('../src/service/cargo-service').default;
  const funcionarioService = require('../src/service/funcionario-service').default;
  const entregadorService = require('../src/service/entregador-service').default;
  const adicionaisService = require('../src/service/adicionais-service').default;
  const grupoService = require('../src/service/grupo-adicional-service').default;
  const promocaoService = require('../src/service/promocao-service').default;
  const configService = require('../src/service/configuracoes-service').default;
  const pedidoService = require('../src/service/pedido-service').default;

  const cargo = entity({ id: 1, nome: 'Caixa', descricao: 'Caixa', permissoes: ['view_orders'], ativo: true });
  const funcionario = entity({ id: 1, nome: 'Ana', telefone: '67999999999', ativo: true, cargoId: 1, userId: 2, user: { id: 2, nome: 'Ana', email: 'ana@teste.com', role: 'Funcionario' }, cargo });
  const entregador = entity({ id: 1, funcionarioId: 1, documento: '12345678901', veiculo: 'Moto', placa: 'ABC1D23', disponivel: true, ativo: true, funcionario });
  const adicional = entity({ id: 1, nomeAdicional: 'Bacon', valor: '5.00', disponivel: true });
  const grupo = entity({ id: 1, nome: 'Extras', obrigatorio: false, maxSelecoes: 2, ativo: true, pratoIds: [1], adicionalIds: [1], items: [adicional] });
  const promocao = entity({ id: 1, titulo: 'Oferta', descricao: '', imagem: '', produtoIds: [1], precosPromocionais: { '1': 19.9 }, ativo: true, clicavel: true, selo: 'Oferta', inicio: null, fim: null, ordem: 1 });
  const config = entity({ id: 1, nomeLoja: 'Loja Teste', descricao: '', numeroLoja: '67999999999', chavePix: '', titularPix: '', valorFrete: '5.00', pedidoMinimo: null, slugCardapio: 'teste', prazoEntrega: '30 min', horarioFuncionamento: 'Todos os dias', aberto: true, corPrimaria: '#ea580c', capaUrl: '' });
  const pedido = entity({ id: 1, codigo: 'PED-1', clienteNome: 'Cliente', clienteTelefone: '67999999999', endereco: {}, pagamento: {}, subtotal: '20.00', valorFrete: '5.00', desconto: '0.00', total: '25.00', status: 'pending', itens: [] });
  const categoria = entity({ id: 1, nome: 'Hambúrgueres', descricao: 'Lanches', imagem: '', ativo: true, ordem: 1 });
  const prato = entity({ id: 1, nome: 'X-Burger', descricao_resumida: 'Lanche', descricao_detalhada: 'Lanche', imagem: '', valor: '20.00', categoriaId: 1, disponivel: true, destaque: false, ordem: 1, categoria });

  Object.assign(cargoService, { listar: async () => [cargo], buscar: async () => cargo, criar: async () => cargo, atualizar: async () => cargo, excluir: async () => undefined });
  Object.assign(funcionarioService, { listar: async () => [funcionario], buscar: async () => funcionario, criar: async () => funcionario, atualizar: async () => funcionario, excluir: async () => undefined });
  Object.assign(entregadorService, { listar: async () => [entregador], buscar: async () => entregador, criar: async () => entregador, atualizar: async () => entregador, excluir: async () => undefined });
  Object.assign(adicionaisService, { listar: async () => [adicional], buscar: async () => adicional, criarAdicional: async () => adicional, atualizar: async () => adicional, excluir: async () => undefined });
  Object.assign(grupoService, { listar: async () => [grupo], buscar: async () => grupo, criar: async () => grupo, atualizar: async () => grupo, excluir: async () => undefined });
  Object.assign(promocaoService, { listar: async () => [promocao], buscar: async () => promocao, criar: async () => promocao, atualizar: async () => promocao, excluir: async () => undefined });
  Object.assign(configService, { obter: async () => config, salvar: async () => config });
  Object.assign(pedidoService, { listar: async () => [pedido], buscar: async () => pedido, criar: async () => pedido, atualizar: async () => pedido, excluir: async () => undefined });

  Categoria.findAll = async () => [categoria];
  Categoria.findByPk = async () => categoria;
  Categoria.create = async () => categoria;
  Prato.findAll = async () => [prato];
  Prato.findByPk = async () => prato;
  Prato.create = async () => prato;
  User.findOne = async () => entity({ id: 1, nome: 'Admin', email: 'admin@demo.com', senha: await bcrypt.hash('admin123', 4), role: 'Gerente' });

  // Prevent accidental DB hits from methods not covered by service stubs.
  Cargo.findAll = async () => [cargo]; Cargo.findByPk = async () => cargo;
  Funcionario.findAll = async () => [funcionario]; Funcionario.findByPk = async () => funcionario;
  Entregador.findAll = async () => [entregador]; Entregador.findByPk = async () => entregador;
  Adicional.findAll = async () => [adicional]; Adicional.findByPk = async () => adicional;
  Grupo.findAll = async () => [grupo]; Grupo.findByPk = async () => grupo;
  Promocao.findAll = async () => [promocao]; Promocao.findByPk = async () => promocao;
  Configuracoes.findByPk = async () => config;
  Pedido.findAll = async () => [pedido]; Pedido.findByPk = async () => pedido;

  const app = require('../src/config/app').default;
  const token = jwt.sign({ sub: '1', email: 'admin@demo.com', role: 'Gerente' }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' });
  const auth = (r) => r.set('Authorization', `Bearer ${token}`);

  const cases = [
    ['post', '/api/login', { email: 'admin@demo.com', senha: 'admin123' }, false, 200],
    ['get', '/api/categorias', null, false, 200], ['get', '/api/categorias/1', null, false, 200], ['post', '/api/categorias', { nome: 'Teste' }, true, 201], ['put', '/api/categorias/1', { nome: 'Teste 2' }, true, 200], ['delete', '/api/categorias/1', null, true, 200],
    ['get', '/api/pratos', null, false, 200], ['get', '/api/pratos/1', null, false, 200], ['post', '/api/pratos', { nome: 'Teste' }, true, 201], ['put', '/api/pratos/1', { nome: 'Teste 2' }, true, 200], ['delete', '/api/pratos/1', null, true, 200],
    ['get', '/api/adicionais', null, false, 200], ['get', '/api/adicionais/1', null, false, 200], ['post', '/api/adicionais', { nomeAdicional: 'Bacon', valor: 5 }, true, 201], ['put', '/api/adicionais/1', { valor: 6 }, true, 200], ['delete', '/api/adicionais/1', null, true, 204],
    ['get', '/api/grupos-adicionais', null, false, 200], ['get', '/api/grupos-adicionais/1', null, false, 200], ['post', '/api/grupos-adicionais', { nome: 'Extras' }, true, 201], ['put', '/api/grupos-adicionais/1', { nome: 'Extras 2' }, true, 200], ['delete', '/api/grupos-adicionais/1', null, true, 204],
    ['get', '/api/promocoes', null, false, 200], ['get', '/api/promocoes/1', null, false, 200], ['post', '/api/promocoes', { titulo: 'Oferta' }, true, 201], ['put', '/api/promocoes/1', { titulo: 'Oferta 2' }, true, 200], ['delete', '/api/promocoes/1', null, true, 204],
    ['get', '/api/configuracoes', null, false, 200], ['put', '/api/configuracoes', { nomeLoja: 'Nova Loja' }, true, 200],
    ['get', '/api/cargos', null, true, 200], ['get', '/api/cargos/1', null, true, 200], ['post', '/api/cargos', { nome: 'Caixa' }, true, 201], ['put', '/api/cargos/1', { nome: 'Caixa 2' }, true, 200], ['delete', '/api/cargos/1', null, true, 204],
    ['get', '/api/funcionarios', null, true, 200], ['get', '/api/funcionarios/1', null, true, 200], ['post', '/api/funcionarios', { nome: 'Ana', email: 'ana@teste.com', senha: '123456', cargoId: 1 }, true, 201], ['put', '/api/funcionarios/1', { nome: 'Ana 2' }, true, 200], ['delete', '/api/funcionarios/1', null, true, 204],
    ['get', '/api/entregadores', null, true, 200], ['get', '/api/entregadores/1', null, true, 200], ['post', '/api/entregadores', { nome: 'João', email: 'joao@teste.com', senha: '123456', veiculo: 'Moto' }, true, 201], ['put', '/api/entregadores/1', { veiculo: 'Carro' }, true, 200], ['delete', '/api/entregadores/1', null, true, 204],
    ['get', '/api/pedidos', null, true, 200], ['get', '/api/pedidos/1', null, true, 200], ['post', '/api/pedidos', { clienteNome: 'Cliente', clienteTelefone: '67999999999', itens: [{ pratoId: 1, quantidade: 1, precoUnitario: 20 }] }, false, 201], ['put', '/api/pedidos/1', { status: 'confirmed' }, true, 200], ['delete', '/api/pedidos/1', null, true, 204],
  ];

  for (const [method, path, body, protectedRoute, expected] of cases) {
    let req = request(app)[method](path);
    if (protectedRoute) req = auth(req);
    if (body) req = req.send(body);
    const res = await req;
    assert.equal(res.status, expected, `${method.toUpperCase()} ${path}: esperado ${expected}, recebido ${res.status}; corpo=${JSON.stringify(res.body)}`);
  }

  console.log(`SMOKE_OK ${cases.length} endpoints`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
