import sequelize from "@/database";
import { StatusPedido } from "@/enums/status-pedido";
import PedidoItem from "@/models/ItemPedido-model";
import Pedido from "@/models/pedido-model";
import Prato from "@/models/prato-model";

const include = [
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
];

export class PedidoService {
  async getPedidos(): Promise<Pedido[]> {
    return Pedido.findAll({
      include,
      order: [["createdAt", "DESC"]],
    });
  }

  async deletePedido(id: string): Promise<void> {
    const pedidoId = Number(id);

    if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
      throw new Error("ID do pedido inválido.");
    }

    const quantidadeExcluida = await Pedido.destroy({
      where: {
        id: pedidoId,
      },
    });

    if (quantidadeExcluida === 0) {
      throw new Error("Pedido não encontrado.");
    }
  }

  async criar(d: any): Promise<Pedido> {
    const subtotal = Number(
      d.itens
        .reduce(
          (s: number, i: any) =>
            s +
            Number(i.precoUnitario) *
              Number(i.quantidade),
          0,
        )
        .toFixed(2),
    );

    const frete = Number(d.valorFrete ?? 0);
    const desconto = Number(d.desconto ?? 0);
    const total = Number(
      (subtotal + frete - desconto).toFixed(2),
    );

    const id = await sequelize.transaction(
      async (transaction) => {
        const pedido = await Pedido.create(
          {
            codigo: `PED-${Date.now()}`,
            clienteNome: d.clienteNome,
            clienteTelefone: d.clienteTelefone,
            endereco: d.endereco ?? {},
            pagamento: d.pagamento ?? {},
            subtotal,
            valorFrete: frete,
            desconto,
            total,
            status: StatusPedido.PENDENTE,
          },
          {
            transaction,
          },
        );

        await PedidoItem.bulkCreate(
          d.itens.map((item: any) => ({
            pedidoId: pedido.id,
            pratoId: item.pratoId,
            quantidade: item.quantidade,
            precoUnitario: item.precoUnitario,
            observacao: item.observacao ?? "",
            adicionais: item.adicionais ?? [],
          })),
          {
            transaction,
          },
        );

        return pedido.id;
      },
    );

    return this.buscar(id);
  }

  async listar(): Promise<Pedido[]> {
    return Pedido.findAll({
      include,
      order: [["createdAt", "DESC"]],
    });
  }

  async buscar(id: number): Promise<Pedido> {
    const pedido = await Pedido.findByPk(id, {
      include,
    });

    if (!pedido) {
      throw new Error("Pedido não encontrado.");
    }

    return pedido;
  }

  async atualizar(
    id: number,
    dados: any,
  ): Promise<Pedido> {
    const pedido = await this.buscar(id);

    const update: Record<string, unknown> = {};

    for (const campo of [
      "status",
      "entregadorId",
      "entregadorNome",
      "motivoCancelamento",
    ]) {
      if (dados[campo] !== undefined) {
        update[campo] = dados[campo];
      }
    }

    if (dados.status === StatusPedido.ENTREGUE) {
      update.entregueEm = new Date();
    }

    if (dados.status === StatusPedido.CANCELADO) {
      update.canceladoEm = new Date();
    }

    await pedido.update(update);

    return this.buscar(id);
  }

  async excluir(id: number): Promise<void> {
    const pedido = await this.buscar(id);

    await pedido.destroy();
  }
}

export default new PedidoService();