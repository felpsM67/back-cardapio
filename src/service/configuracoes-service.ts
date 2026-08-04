import Configuracoes from "@/models/configuracoes-model";
import { CreateConfiguracoesDTO, UpdateConfiguracoesDTO } from "@/types/configuracoes";

export class ConfiguracoesService {

    async criarConfiguracoes(novasConfiguracoes: CreateConfiguracoesDTO) : Promise<Configuracoes> {
        return await Configuracoes.create(novasConfiguracoes);
    }
    async buscarConfiguracoes(): Promise<Configuracoes[]> {
        return await Configuracoes.findAll();
    }
    async buscarConfiguracoesPorId(id: number): Promise<Configuracoes | null> {
        return await Configuracoes.findByPk(id);
    }
    async atualizarConfiguracoes(id: number, configuracoesAtualizadas: UpdateConfiguracoesDTO): Promise<[number, Configuracoes[]]> {
        return await Configuracoes.update(configuracoesAtualizadas, {
            where: { id },
            returning: true,
        });
    }
    async deletarConfiguracoes(id: number): Promise<number> {
        return await Configuracoes.destroy({
            where: { id },
        });
    }
}
