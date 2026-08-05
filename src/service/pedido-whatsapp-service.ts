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
  async enviarAtualizacaoStatus(pedido: any): Promise<void> {
  const status = String(pedido.status ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  let mensagemStatus = '';

  switch (status) {
  case 'CONFIRMED':
  case 'CONFIRMADO':
    mensagemStatus =
      '✅ Seu pedido foi confirmado pela loja!';
    break;

  case 'PREPARING':
  case 'PREPARANDO':
  case 'EM_PREPARO':
    mensagemStatus =
      '👨‍🍳 Seu pedido já está sendo preparado.';
    break;

  case 'OUT_FOR_DELIVERY':
  case 'SAIU_ENTREGA':
  case 'SAIU_PARA_ENTREGA':
    mensagemStatus =
      '🛵 Seu pedido saiu para entrega e chegará em breve!';
    break;

  case 'DELIVERED':
  case 'ENTREGUE':
    mensagemStatus =
      '🎉 Seu pedido foi entregue. Obrigado pela preferência!';
    break;

  case 'CANCELLED':
  case 'CANCELADO':
    mensagemStatus = pedido.motivoCancelamento
      ? `❌ Seu pedido foi cancelado.\nMotivo: ${pedido.motivoCancelamento}`
      : '❌ Seu pedido foi cancelado.';
    break;

  default:
    console.log('Status sem mensagem configurada:', status);
    return;
}

  const codigo =
    pedido.codigo ?? `PED-${pedido.id}`;

  const mensagem = [
    `🍔 *Atualização do pedido ${codigo}*`,
    '',
    `Olá, ${pedido.clienteNome}!`,
    '',
    mensagemStatus,
    '',
    'Você receberá novas atualizações por aqui.',
  ].join('\n');

  await zapiService.sendText(
    pedido.clienteTelefone,
    mensagem,
  );
}
}

export default new PedidoWhatsappService();