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

export default class EditarCargoController
  implements Controller
{
  async handle(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    try {
      const id = Number(httpRequest.params?.id);

      if (!Number.isInteger(id) || id <= 0) {
        return badRequest(
         new Error ("ID do cargo inválido."),
        );
      }


      const cargo = await cargoService.atualizar(
        id,
        httpRequest.body,
      );

      return ok(cargo);
    } catch (error: any) {
      if (error.message === "Cargo não encontrado.") {
        return notFound({
          error: error.message,
        });
      }

      if (error.message?.includes("Já existe")) {
        return badRequest(
         new Error("Já existente")
        );
      }

      return serverError(error);
    }
  }
}