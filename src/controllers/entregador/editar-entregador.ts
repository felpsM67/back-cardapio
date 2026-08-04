import { notFound, ok, serverError } from "../../helpers/http-helper";
import Entregador from "@/models/entregador-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";
import { CreateEntregadorDTO } from "@/types/Entregador";

export default class EditarEntregadorController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;

      const {
        nome,
        telefone,
        placa,
        disponivel,
        ativo,
        userId,
      }: CreateEntregadorDTO = httpRequest.body;

      const entregador = await Entregador.findByPk(id);

      if (!entregador) {
        return notFound({ error: "Entregador não encontrado" });
      }

      await entregador.save(httpRequest.body);

      return ok(entregador);
    } catch (error: any) {
      return serverError(error);
    }
  }
}