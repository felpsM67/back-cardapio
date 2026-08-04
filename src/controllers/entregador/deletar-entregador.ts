import { notFound, ok, serverError } from "../../helpers/http-helper";
import Entregador from "@/models/entregador-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export default class DeletarEntregadorController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      const entregador = await Entregador.findByPk(id);

      if (!entregador) {
        return notFound({ error: "Entregador não encontrado" });
      }

      await entregador.destroy();

      return ok({
        message: "Entregador deletado com sucesso.",
      });
    } catch (error: any) {
      return serverError(error);
    }
  }
}