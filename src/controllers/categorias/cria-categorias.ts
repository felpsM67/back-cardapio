import { created, serverError } from "../../helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { CategoriaService } from "@/service/categorias-service";

export class CriarCategoriaController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      try {
        const categoriaService = new CategoriaService();
        const CategoriaCriado = await categoriaService.criaCategoria(httpRequest.body);
        return created(CategoriaCriado);
      } catch (error: any) {
        return serverError(error)
      }
    }
}