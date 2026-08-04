import { notFound, ok, serverError } from "../../helpers/http-helper";
import Categorias from "@/models/categoria-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export default class EditarCategoriaController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const categoria = await Categorias.findByPk(id);

      if (!categoria) {
        return notFound({ error: "Categoria não encontrada" });
      }

      await categoria.update(httpRequest.body);
      return ok(categoria);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
