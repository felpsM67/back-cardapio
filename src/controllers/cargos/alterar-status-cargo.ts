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
      const { ativo } = httpRequest.body;

      if (!Number.isInteger(id) || id <= 0) {
        return badRequest(
         new Error ("ID do cargo inválido."),
        );
      }

      if (typeof ativo !== "boolean") {
        return badRequest(
         new Error ("O campo ativo deve ser booleano."),
        );
      }

      const cargo = await cargoService.alterarStatus(
        id,
        ativo,
      );

      return ok(cargo);
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