import { notFound, ok, serverError } from "../../helpers/http-helper";
import Adicionais from "@/models/adicionais-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export default class ListarAdicionaisController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const adicionaisId = httpRequest.params.id;
      const adicionais = await Adicionais.findByPk(adicionaisId);
      if (!adicionais && adicionaisId !== "{id}" && adicionaisId !== undefined) {
        return notFound({ error: "Prato não encontrado" });
      } else if (adicionaisId !== "{id}" && adicionaisId !== undefined) {
        return ok(adicionais);
      }
      const pratos = await Adicionais.findAll();
      return ok(pratos);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
