import { notFound, ok, serverError } from "../../helpers/http-helper";
import Adicionais from "@/models/adicionais-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { CreateAdicionalDTO } from "@/types/Adicionais";
import { error } from "console";

export default class EditarAdicioanisController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const { 
        nomeAdicional,
        valor,
      }: CreateAdicionalDTO = httpRequest.body;

      const adicionais = await Adicionais.findByPk(id);

      if (!adicionais) {
        return notFound({error: "Adicional não encontrado"});
      }

      await adicionais.save(httpRequest.body);

      return ok(adicionais);
      } catch(error:any) {
        return serverError(error);
      }
    }
}
