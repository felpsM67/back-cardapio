import Adicionais from "@/models/adicionais-model";
import { CreateAdicionalDTO } from "@/types/Adicionais";

export class AdicionaisService {

    async criarAdicional(novaoAdicional: CreateAdicionalDTO) : Promise<Adicionais> {
        return await Adicionais.create(novaoAdicional)
    }
}