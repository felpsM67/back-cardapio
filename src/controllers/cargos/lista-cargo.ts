import {
  ok,
  serverError,
} from "@/helpers/http-helper";

import {
  Controller,
  HttpRequest,
  HttpResponse,
} from "@/protocols";

import cargoService from "@/service/cargo-service";

export default class ListarCargosController
  implements Controller
{
  async handle(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    try {
      const apenasAtivos =
        httpRequest.query?.ativos === "true";


      const cargos = await cargoService.listar(
        apenasAtivos,
      );

      return ok(cargos);
    } catch (error: any) {
      return serverError(error);
    }
  }
}