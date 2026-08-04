import { notFound, ok, serverError } from "../../helpers/http-helper";
import Prato from "../../models/prato-model";
import Categorias from "../../models/categoria-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export default class ListarPratoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const pratoId = httpRequest.params.id;
      const include = [{ model: Categorias, as: "categoria" }];

      if (pratoId !== undefined && pratoId !== "{id}") {
        const prato = await Prato.findByPk(pratoId, { include });
        return prato ? ok(prato) : notFound({ error: "Prato não encontrado" });
      }

      const pratos = await Prato.findAll({
        include,
        order: [
          ["ordem", "ASC"],
          ["nome", "ASC"],
        ],
      });

      return ok(pratos);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
