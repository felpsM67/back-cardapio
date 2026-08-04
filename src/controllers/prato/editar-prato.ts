import { notFound, ok, serverError } from "../../helpers/http-helper";
import Prato from "../../models/prato-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";

export default class EditarPratoController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const prato = await Prato.findByPk(id);

      if (!prato) {
        return notFound({ error: "Prato não encontrado" });
      }

      await prato.update(httpRequest.body);
      return ok(prato);
    } catch (error: any) {
      return serverError(error);
    }
  }
}
