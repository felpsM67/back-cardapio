import Prato from "../models/prato-model";
import { CreatePratoDTO } from "../types";


export class PratoService {
  
    async criarPrato(novoPrato: CreatePratoDTO): Promise<Prato> {
        return await Prato.create(novoPrato);
    }
}