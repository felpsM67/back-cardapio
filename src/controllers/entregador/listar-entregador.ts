import { notFound, ok, serverError } from "../../helpers/http-helper";
import Entregador from "@/models/entregador-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export default class ListaEntregadorController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      if (id) {
        const entregador = await Entregador.findByPk(id);

        if (!entregador) {
          return notFound({ error: "Entregador não encontrado" });
        }

        return ok(entregador);
      }

      const entregadores = await Entregador.findAll();

      return ok(entregadores);
    } catch (error: any) {
      return serverError(error);
    }
  }
}