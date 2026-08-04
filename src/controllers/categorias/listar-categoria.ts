import { notFound, ok, serverError } from "@/helpers/http-helper";
import Categorias from "@/models/categoria-model";
import { Controller, HttpRequest, HttpResponse } from "@/protocols";

export default class ListaCategoriasController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const categoriaId = httpRequest.params.id;

      if (categoriaId !== undefined && categoriaId !== "{id}") {
        const categoria = await Categorias.findByPk(categoriaId);
        return categoria
          ? ok(categoria)
          : notFound({ error: "Categoria não encontrada" });
      }

      const categorias = await Categorias.findAll({
        order: [
          ["ordem", "ASC"],
          ["nome", "ASC"],
        ],
      });

      return ok(categorias);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
