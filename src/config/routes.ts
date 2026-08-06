import type { Express } from "express";
import { Router } from "express";

// Adicionais
import buscarAdicional from "../routes/adicionais/buscar";
import criarAdicional from "../routes/adicionais/criar";
import deletarAdicional from "../routes/adicionais/deletar";
import editarAdicional from "../routes/adicionais/editar";
import listarAdicionais from "../routes/adicionais/listar";

// Z-API
import testarZapi from "../routes/api-zap/testar";


// Cargos
import buscarCargo from "../routes/cargos/buscar";
import criarCargo from "../routes/cargos/criar";
import deletarCargo from "../routes/cargos/deletar";
import editarCargo from "../routes/cargos/editar";
import listarCargos from "../routes/cargos/listar";
import alterarStatusCargo from "../routes/cargos/alterar-status-cargo";

// Categorias
import criarCategoria from "../routes/categorias/criar-categorias";
import deletarCategoria from "../routes/categorias/deletar-categorias";
import editarCategoria from "../routes/categorias/editar-categorias";
import listarCategorias from "../routes/categorias/lista-categorias";

// Configurações
import editarConfiguracoes from "../routes/configuracoes/editar-configuracoes";
import obterConfiguracoes from "../routes/configuracoes/obter";
import salvarConfiguracoes from "../routes/configuracoes/salvar";

// Entregadores
import buscarEntregador from "../routes/entregador/buscar";
import criarEntregador from "../routes/entregador/criar";
import deletarEntregador from "../routes/entregador/deletar";
import editarEntregador from "../routes/entregador/editar";
import listarEntregadores from "../routes/entregador/listar";

// Funcionários
import buscarFuncionario from "../routes/funcionarios/buscar";
import criarFuncionario from "../routes/funcionarios/criar";
import deletarFuncionario from "../routes/funcionarios/deletar";
import editarFuncionario from "../routes/funcionarios/editar";
import listarFuncionarios from "../routes/funcionarios/listar";

// Grupos de adicionais
import buscarGrupoAdicional from "../routes/grupos-adicionais/buscar";
import criarGrupoAdicional from "../routes/grupos-adicionais/criar";
import deletarGrupoAdicional from "../routes/grupos-adicionais/deletar";
import editarGrupoAdicional from "../routes/grupos-adicionais/editar";
import listarGruposAdicionais from "../routes/grupos-adicionais/listar";

// Login
import login from "../routes/login/login";
import refreshToken from "../routes/login/refresh-token";

// Pedidos
import atualizarPedido from "../routes/pedidos/atualizar-pedido";
import buscarPedido from "../routes/pedidos/buscar";
import criarPedido from "../routes/pedidos/criar";
import deletarPedido from "../routes/pedidos/deletar";
import editarPedido from "../routes/pedidos/editar";
import listarPedidos from "../routes/pedidos/listar";

// Pratos
import criarPrato from "../routes/prato/criar-prato";
import deletarPrato from "../routes/prato/deletar-prato";
import editarPrato from "../routes/prato/editar-prato";
import listarPratos from "../routes/prato/listar-prato";

// Promoções
import buscarPromocao from "../routes/promocoes/buscar";
import criarPromocao from "../routes/promocoes/criar";
import deletarPromocao from "../routes/promocoes/deletar";
import editarPromocao from "../routes/promocoes/editar";
import listarPromocoes from "../routes/promocoes/listar";

// Usuários
import criarUsuario from "../routes/usuarios/criar-usuario";
import deletarUsuario from "../routes/usuarios/deletar-usuario";
import editarUsuario from "../routes/usuarios/editar-usuario";
import listarUsuarios from "../routes/usuarios/listar-usuario";


import zapiRecebimento from '../routes/webhooks/zapi-recebimento';
export default function setupRoutes(app: Express): void {
  const router = Router();

  app.use("/api", router);

  const routes = [
    // Adicionais
    buscarAdicional,
    criarAdicional,
    deletarAdicional,
    editarAdicional,
    listarAdicionais,

    // Z-API
    testarZapi,
    zapiRecebimento,

    // Cargos
    buscarCargo,
    criarCargo,
    deletarCargo,
    editarCargo,
    listarCargos,
    alterarStatusCargo,

    // Categorias
    criarCategoria,
    deletarCategoria,
    editarCategoria,
    listarCategorias,

    // Configurações
    editarConfiguracoes,
    obterConfiguracoes,
    salvarConfiguracoes,

    // Entregadores
    buscarEntregador,
    criarEntregador,
    deletarEntregador,
    editarEntregador,
    listarEntregadores,

    // Funcionários
    buscarFuncionario,
    criarFuncionario,
    deletarFuncionario,
    editarFuncionario,
    listarFuncionarios,

    // Grupos de adicionais
    buscarGrupoAdicional,
    criarGrupoAdicional,
    deletarGrupoAdicional,
    editarGrupoAdicional,
    listarGruposAdicionais,

    // Login
    login,
    refreshToken,

    // Pedidos
    atualizarPedido,
    buscarPedido,
    criarPedido,
    deletarPedido,
    editarPedido,
    listarPedidos,

    // Pratos
    criarPrato,
    deletarPrato,
    editarPrato,
    listarPratos,

    // Promoções
    buscarPromocao,
    criarPromocao,
    deletarPromocao,
    editarPromocao,
    listarPromocoes,

    // Usuários
    criarUsuario,
    deletarUsuario,
    editarUsuario,
    listarUsuarios,
  ];

  for (const mountRoute of routes) {
    mountRoute(router);
  }

  console.log(
    `[routes] ${routes.length} arquivos de rota registrados.`,
  );
}