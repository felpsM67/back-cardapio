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

export default class AlterarStatusCargoController
  implements Controller
{
  async handle(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    try {
      const id = Number(httpRequest.params?.id);
      const ativo = httpRequest.body?.ativo;

      if (!Number.isInteger(id) || id <= 0) {
        return badRequest(
          new Error("ID do cargo inválido."),
        );
      }

      if (typeof ativo !== "boolean") {
        return badRequest(
          new Error(
            "O campo ativo deve ser booleano.",
          ),
        );
      }

      const cargo = await cargoService.atualizar(
        id,
        { ativo },
      );

      return ok(cargo);
    } catch (error: unknown) {
      const erro =
        error instanceof Error
          ? error
          : new Error(
              "Erro interno ao alterar o status do cargo.",
            );

      if (erro.message === "Cargo não encontrado.") {
        return notFound(erro);
      }

      return serverError(erro);
    }
  }
}