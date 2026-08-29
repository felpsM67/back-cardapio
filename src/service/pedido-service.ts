import { randomUUID } from "node:crypto";

import sequelize from "@/database";
import { StatusPedido } from "@/enums/status-pedido";
import PedidoItem from "@/models/ItemPedido-model";
import Pedido from "@/models/pedido-model";
import Prato from "@/models/prato-model";
import pedidoWhatsappService from "@/service/pedido-whatsapp-service";

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
    const tipoEntrega =
      d.tipoEntrega === "RETIRADA"
        ? "RETIRADA"
        : "ENTREGA";

    const subtotal = Number(
      d.itens
        .reduce(
          (soma: number, item: any) =>
            soma +
            Number(item.precoUnitario) *
              Number(item.quantidade),
          0,
        )
        .toFixed(2),
    );

    const frete =
      tipoEntrega === "RETIRADA"
        ? 0
        : Number(d.valorFrete ?? 0);
    const desconto = Number(d.desconto ?? 0);

    const total = Number(
      (subtotal + frete - desconto).toFixed(2),
    );

    const id = await sequelize.transaction(
      async (transaction) => {
        /*
         * O código temporário é usado porque o ID do pedido
         * somente existe depois que o registro é criado.
         */
        const pedido = await Pedido.create(
          {
            codigo: `TEMP-${randomUUID()}`,
            clienteNome: d.clienteNome,
            clienteTelefone: d.clienteTelefone,
            endereco: {
              ...(d.endereco ?? {}),
              tipoEntrega,
            },
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

        /*
         * Exemplo:
         * ID 1   -> PED-000001
         * ID 25  -> PED-000025
         * ID 387 -> PED-000387
         */
        const codigoPedido = `PED-${String(
          pedido.id,
        ).padStart(6, "0")}`;

        await pedido.update(
          {
            codigo: codigoPedido,
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

    const novoPedido = await this.buscar(id);

    try {
      await pedidoWhatsappService.enviarConfirmacao(
        novoPedido,
      );
    } catch (error) {
      console.error(
        "Pedido criado, mas o WhatsApp não foi enviado:",
        error,
      );
    }

    return novoPedido;
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

  const statusAnterior = String(
    pedido.status ?? '',
  );

  const update: Record<string, unknown> = {};

  const camposPermitidos = [
    'status',
    'entregadorId',
    'entregadorNome',
    'motivoCancelamento',
  ];

  for (const campo of camposPermitidos) {
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

  const pedidoAtualizado = await this.buscar(id);

  const statusAtual = String(
    pedidoAtualizado.status ?? '',
  );

  const statusFoiAlterado =
    dados.status !== undefined &&
    statusAnterior !== statusAtual;

  if (statusFoiAlterado) {
    try {
      await pedidoWhatsappService.enviarAtualizacaoStatus(
        pedidoAtualizado,
      );
    } catch (error) {
      console.error(
        'Status atualizado, mas a mensagem do WhatsApp não foi enviada:',
        error,
      );
    }
  }

  return pedidoAtualizado;
}

  async excluir(id: number): Promise<void> {
    const pedido = await this.buscar(id);

    await pedido.destroy();
  }
}

export default new PedidoService();
