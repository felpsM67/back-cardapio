import { notFound, ok, serverError } from "../../helpers/http-helper";
import Adicionais from "@/models/adicionais-model";
import { Controller, HttpRequest, HttpResponse } from "../../protocols";


export default class DeletarAdicionaisController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { id } = httpRequest.params;

            const adicionais = await Adicionais.findByPk(id);

            if (!adicionais) {
                return notFound({ error: "Adicional não encontrado"});
            }

            await adicionais.destroy();

            return ok({ message: "Adicional Criado com sucesso"});
        } catch (error: any) {
            return serverError(error);
        }
    }
}