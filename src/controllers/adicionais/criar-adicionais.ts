import { created, serverError } from "@/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { AdicionaisService } from "@/service/adicionais-service";

export class CriarAdicionaisController implements Controller { 
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const adicionaisService = new AdicionaisService();
            const adicionaisCriado = await adicionaisService.criarAdicional(httpRequest.body);
            return created(adicionaisCriado); 
        } catch (error: any) {
            return serverError(error);
        }
    }
}