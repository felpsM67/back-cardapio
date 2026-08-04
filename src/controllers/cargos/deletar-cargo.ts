import {
  badRequest,
  noContent,
  notFound,
  serverError,
} from "@/helpers/http-helper";

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/protocols";

import cargoService from "@/service/cargo-service";

export default class DeletarCargoController
  implements Controller
{
  async handle(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    try {
      const id = Number(httpRequest.params?.id);

      if (!Number.isInteger(id) || id <= 0) {
        return badRequest(
            new Error("Erro interno do servidor")
        )
      }

      await cargoService.excluir(id);

      return noContent();
    } catch (error: any) {
      if (error.message === "Cargo não encontrado.") {
        return notFound({
          error: error.message,
        });
      }

      return serverError(error);
    }
  }
}