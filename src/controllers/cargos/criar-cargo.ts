import {
  badRequest,
  created,
  serverError,
} from "@/helpers/http-helper";

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/protocols";

import cargoService from "@/service/cargo-service";

export default class CriarCargoController
  implements Controller
{
  async handle(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    try {
      const cargo = await cargoService.criar(
        httpRequest.body,
      );

      return created(cargo);
    } catch (error: unknown) {
      const erro =
        error instanceof Error
          ? error
          : new Error("Erro interno ao criar o cargo.");

      if (erro.message.includes("Já existe")) {
        return badRequest(erro);
      }

      return serverError(erro);
    }
  }
}