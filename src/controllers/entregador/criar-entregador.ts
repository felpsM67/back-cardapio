import { created, serverError } from "@/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { EntregadorService } from "@/service/entregador-service";

export class CriarEntregadorController implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const entregadorService = new EntregadorService();
            const enntregadorCriado = await entregadorService.criarEntregador(httpRequest.body);
            return created(enntregadorCriado); 
        } catch ( error: any) {
            return serverError(error)
        }
    }
}