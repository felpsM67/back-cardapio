import {
  badRequest,
  notFound,
  ok,
  serverError,
} from "@/helpers/http-helper";

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/protocols";

import cargoService from "@/service/cargo-service";

export default class BuscarController implements Controller {
  async handle(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    try {
      const id = Number(httpRequest.params?.id);

      if (!Number.isInteger(id) || id < 1) {
        return badRequest(
          new Error("ID do cargo inválido."),
        );
      }

      const cargo = await cargoService.buscarPorId(id);

      return ok(cargo);
    } catch (error: unknown) {
      const erro =
        error instanceof Error
          ? error
          : new Error("Erro ao buscar cargo.");

      if (erro.message === "Cargo não encontrado.") {
        return notFound(erro);
      }

      return serverError(erro);
    }
  }
}