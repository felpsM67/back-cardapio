import Categorias from "@/models/categoria-model";
import { CreateCategoriaDTO } from "@/types/categorias";
 
export class CategoriaService{

    async criaCategoria(novoCategoria: CreateCategoriaDTO): Promise<Categorias> {
        return await Categorias.create(novoCategoria)
    }
}
