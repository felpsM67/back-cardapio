import { zapiService } from "./zapi-service";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

class PedidoWhatsappService {
  async enviarConfirmacao(
    pedido: any,
  ): Promise<void> {
    const itens = Array.isArray(pedido.itens)
      ? pedido.itens
          .map((item: any) => {
            const nome =
              item.prato?.nome ??
              `Produto ${item.pratoId}`;

            const quantidade =
              Number(item.quantidade) || 0;

            const precoUnitario =
              Number(item.precoUnitario) || 0;

            return (
              `• ${quantidade}x ${nome} — ` +
              formatCurrency(
                quantidade * precoUnitario,
              )
            );
          })
          .join("\n")
      : "Itens não informados";

    const mensagem = [
      "✅ *Pedido recebido!*",
      "",
      `Olá, ${pedido.clienteNome}!`,
      `Recebemos o pedido *#${pedido.codigo}*.`,
      "",
      "*Itens:*",
      itens,
      "",
      `Subtotal: ${formatCurrency(
        Number(pedido.subtotal),
      )}`,
      `Entrega: ${formatCurrency(
        Number(pedido.valorFrete),
      )}`,
      `Desconto: ${formatCurrency(
        Number(pedido.desconto),
      )}`,
      `*Total: ${formatCurrency(
        Number(pedido.total),
      )}*`,
      "",
      "Seu pedido está aguardando confirmação da loja.",
    ].join("\n");

    await zapiService.sendText(
      pedido.clienteTelefone,
      mensagem,
    );
  }
}

export default new PedidoWhatsappService();