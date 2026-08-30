import { ForeignKeyConstraintError } from "sequelize";
import { conflict, notFound, ok, serverError } from "../../helpers/http-helper";
import PedidoItem from "../../models/ItemPedido-model";
import Prato from "../../models/prato-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export default class DeletarPratoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      const prato = await Prato.findByPk(id);

      if (!prato) {
        return notFound({ error: "Prato não encontrado" });
      }

      const quantidadeEmPedidos = await PedidoItem.count({
        where: { pratoId: prato.id },
      });

      if (quantidadeEmPedidos > 0) {
        return conflict({
          message:
            "Este produto faz parte do histórico de pedidos e não pode ser excluído. Desative-o para removê-lo do cardápio.",
        });
      }

      await prato.destroy();

      return ok({ message: "Prato deletado com sucesso" });
    } catch (error: unknown) {
      if (
        error instanceof ForeignKeyConstraintError ||
        (error instanceof Error &&
          error.name === "SequelizeForeignKeyConstraintError")
      ) {
        return conflict({
          message:
            "Este produto faz parte do histórico de pedidos e não pode ser excluído. Desative-o para removê-lo do cardápio.",
        });
      }

      return serverError(error);
    }
  }
}
