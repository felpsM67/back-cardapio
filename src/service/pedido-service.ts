import { BcryptAdapter } from "@/adapters/bcrypt-adapter";
import sequelize from "@/database";
import { StatusPedido } from "@/enums/status-pedido";
import Cliente from "@/models/cliente-model";
import PedidoItem from "@/models/ItemPedido-model";
import PedidoModel from "@/models/pedido-model";
import Prato from "@/models/prato-model";
import {
  CreatePedidoDTO,
  PedidoItemDTO,
  UpdatePedidoDTO,
} from "@/types";

import { UsuarioService } from "./usuario-service";

export class PedidoService {
  async createPedido(dto: CreatePedidoDTO) {
    this.__validarItens(dto.itens);

    const cliente = await this.__buscarOuCriarCliente(
      dto.clienteTelefone
    );

    const total = this.__calcularTotal(dto.itens);
    const codigo = `PED-${Date.now()}`;

    const pedidoId = await sequelize.transaction(
      async (transaction) => {
        const pedido = await PedidoModel.create(
          {
            codigo,
            clienteId: cliente.id,
            total,
            status: StatusPedido.CRIADO,
          },
          {
            transaction,
          }
        );

        await PedidoItem.bulkCreate(
          dto.itens.map((item) => ({
            pedidoId: pedido.id,
            pratoId: item.pratoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
          })),
          {
            transaction,
          }
        );

        return pedido.id;
      }
    );

    return this.getPedidoById(String(pedidoId));
  }

  async getPedidos() {
    return PedidoModel.findAll({
      include: [
        {
          model: Cliente,
          as: "cliente",
        },
        {
          model: PedidoItem,
          as: "itens",
          include: [
            {
              model: Prato,
              as: "prato",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getPedidoById(id: string) {
    const pedidoId = this.__validarId(id);

    const pedido = await PedidoModel.findByPk(pedidoId, {
      include: [
        {
          model: Cliente,
          as: "cliente",
        },
        {
          model: PedidoItem,
          as: "itens",
          include: [
            {
              model: Prato,
              as: "prato",
            },
          ],
        },
      ],
    });

    if (!pedido) {
      throw new Error("Pedido não encontrado");
    }

    return pedido;
  }

  async updatePedido(id: string, dto: UpdatePedidoDTO) {
    const pedidoId = this.__validarId(id);

    await sequelize.transaction(async (transaction) => {
      const pedido = await PedidoModel.findByPk(pedidoId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!pedido) {
        throw new Error("Pedido não encontrado");
      }

      if (dto.status) {
        this.__validarTransicaoStatus(
          pedido.status,
          dto.status
        );

        pedido.status = dto.status;
      }

      if (dto.itens) {
        this.__validarItens(dto.itens);

        await PedidoItem.destroy({
          where: {
            pedidoId: pedido.id,
          },
          transaction,
        });

        await PedidoItem.bulkCreate(
          dto.itens.map((item) => ({
            pedidoId: pedido.id,
            pratoId: item.pratoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
          })),
          {
            transaction,
          }
        );

        pedido.total = this.__calcularTotal(dto.itens);
      }

      await pedido.save({
        transaction,
      });
    });

    return this.getPedidoById(String(pedidoId));
  }

  async deletePedido(id: string) {
    const pedidoId = this.__validarId(id);

    const quantidadeExcluida = await PedidoModel.destroy({
      where: {
        id: pedidoId,
      },
    });

    if (!quantidadeExcluida) {
      throw new Error("Pedido não encontrado");
    }
  }

  __calcularTotal(itens: PedidoItemDTO[]): number {
    const total = itens.reduce(
      (acumulado, item) =>
        acumulado +
        item.quantidade * item.precoUnitario,
      0
    );

    return Number(total.toFixed(2));
  }

  __validarTransicaoStatus(
    atual: StatusPedido,
    novo: StatusPedido
  ) {
    const transicoes: Record<
      StatusPedido,
      StatusPedido[]
    > = {
      [StatusPedido.CRIADO]: [
        StatusPedido.PAGO,
        StatusPedido.CANCELADO,
      ],

      [StatusPedido.PAGO]: [
        StatusPedido.ENVIADO,
        StatusPedido.CANCELADO,
      ],

      [StatusPedido.ENVIADO]: [],

      [StatusPedido.CANCELADO]: [],
    };

    if (!transicoes[atual].includes(novo)) {
      throw new Error(
        `Transição inválida de ${atual} para ${novo}`
      );
    }
  }

  private __validarItens(itens: PedidoItemDTO[]) {
    if (!Array.isArray(itens) || itens.length === 0) {
      throw new Error(
        "O pedido deve possuir pelo menos um item"
      );
    }

    for (const item of itens) {
      if (!item.pratoId || item.pratoId < 1) {
        throw new Error("Prato inválido");
      }

      if (!Number.isInteger(item.quantidade)) {
        throw new Error(
          "A quantidade deve ser um número inteiro"
        );
      }

      if (item.quantidade < 1) {
        throw new Error(
          "A quantidade deve ser pelo menos 1"
        );
      }

      if (item.precoUnitario < 0) {
        throw new Error(
          "O preço unitário não pode ser negativo"
        );
      }
    }
  }

  private __validarId(id: string): number {
    const pedidoId = Number(id);

    if (
      !Number.isInteger(pedidoId) ||
      pedidoId <= 0
    ) {
      throw new Error("ID do pedido inválido");
    }

    return pedidoId;
  }

  private async __buscarOuCriarCliente(
    telefone: string
  ): Promise<Cliente> {
    let cliente = await Cliente.findOne({
      where: {
        telefone,
      },
    });

    if (cliente) {
      return cliente;
    }

    const timestamp = Date.now();

    const encrypter = new BcryptAdapter(12);
    const usuarioService = new UsuarioService(encrypter);

    const usuario = await usuarioService.criarUsuario({
      nome: `Cliente_${timestamp}`,
      email: `cliente_${timestamp}@cardapio.local`,
      telefone,
      senha: "cliente123",
      role: "Cliente",
    });

    cliente =
      (await usuarioService.__buscarPerfilPorUserId(
        usuario.id
      )) as Cliente;

    if (!cliente) {
      throw new Error("Erro ao criar cliente");
    }

    return cliente;
  }
}