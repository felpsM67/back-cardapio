import { zapiService } from "./zapi-service";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const DIVIDER = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬";

class PedidoWhatsappService {
  async enviarConfirmacao(
    pedido: any,
  ): Promise<void> {
    const retirada =
      pedido.endereco?.tipoEntrega === "RETIRADA";

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
              `*${quantidade}x* ${nome}\n` +
              `      ${formatCurrency(
                quantidade * precoUnitario,
              )}`
            );
          })
          .join("\n\n")
      : "Itens não informados";

    const mensagem = [
      "✅ *PEDIDO RECEBIDO*",
      DIVIDER,
      "",
      `Olá, ${pedido.clienteNome}! 👋`,
      `Recebemos o seu pedido *#${pedido.codigo}*`,
      "",
      "🧾 *ITENS*",
      "",
      itens,
      "",
      DIVIDER,
      `Subtotal            ${formatCurrency(Number(pedido.subtotal))}`,
      retirada
        ? "Retirada na loja    Grátis"
        : `Entrega             ${formatCurrency(Number(pedido.valorFrete))}`,
      Number(pedido.desconto) > 0
        ? `Desconto          − ${formatCurrency(Number(pedido.desconto))}`
        : "",
      "",
      `*TOTAL: ${formatCurrency(Number(pedido.total))}*`,
      DIVIDER,
      "",
      "⏳ Aguardando confirmação da loja...",
    ]
      .filter((line) => line !== "")
      .join("\n");

    await zapiService.sendText(
      pedido.clienteTelefone,
      mensagem,
    );
  }

  async enviarAtualizacaoStatus(pedido: any): Promise<void> {
    const status = String(pedido.status ?? '')
      .trim()
      .toUpperCase()
      .replace(/[\s-]+/g, '_');

    let icone = '';
    let mensagemStatus = '';

    switch (status) {
      case 'CONFIRMED':
      case 'CONFIRMADO':
        icone = '✅';
        mensagemStatus = 'Seu pedido foi *confirmado* pela loja!';
        break;

      case 'PREPARING':
      case 'PREPARANDO':
      case 'EM_PREPARO':
        icone = '👨‍🍳';
        mensagemStatus = 'Seu pedido já está *sendo preparado*.';
        break;

      case 'OUT_FOR_DELIVERY':
      case 'SAIU_ENTREGA':
      case 'SAIU_PARA_ENTREGA':
        icone = '🛵';
        mensagemStatus = 'Seu pedido *saiu para entrega* e chegará em breve!';
        break;

      case 'DELIVERED':
      case 'ENTREGUE':
        icone = '🎉';
        mensagemStatus = 'Seu pedido foi *entregue*. Obrigado pela preferência!';
        break;

      case 'CANCELLED':
      case 'CANCELADO':
        icone = '❌';
        mensagemStatus = pedido.motivoCancelamento
          ? `Seu pedido foi *cancelado*.\nMotivo: ${pedido.motivoCancelamento}`
          : 'Seu pedido foi *cancelado*.';
        break;

      default:
        console.log('Status sem mensagem configurada:', status);
        return;
    }

    const codigo =
      pedido.codigo ?? `PED-${pedido.id}`;

    const mensagem = [
      `🍔 *PEDIDO ${codigo}*`,
      DIVIDER,
      "",
      `Olá, ${pedido.clienteNome}!`,
      "",
      `${icone} ${mensagemStatus}`,
      "",
      DIVIDER,
      "_Você receberá novas atualizações por aqui._",
    ].join("\n");

    await zapiService.sendText(
      pedido.clienteTelefone,
      mensagem,
    );
  }
}

export default new PedidoWhatsappService();
