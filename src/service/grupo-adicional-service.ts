import { Op } from "sequelize";
import GrupoAdicional from "@/models/grupo-adicional-model";
import Adicionais from "@/models/adicionais-model";

async function expand(grupo: GrupoAdicional) {
  const items = grupo.adicionalIds.length
    ? await Adicionais.findAll({
        where: { id: { [Op.in]: grupo.adicionalIds } },
        order: [["nomeAdicional", "ASC"]],
      })
    : [];

  return {
    ...grupo.toJSON(),
    items,
  };
}

export class GrupoAdicionalService {
  async listar() {
    const grupos = await GrupoAdicional.findAll({
      order: [["nome", "ASC"]],
    });

    return Promise.all(grupos.map(expand));
  }

  async buscar(id: number) {
    const grupo = await GrupoAdicional.findByPk(id);

    if (!grupo) {
      throw new Error("Grupo de adicionais não encontrado.");
    }

    return expand(grupo);
  }

  async criar(dados: any) {
    const grupo = await GrupoAdicional.create({
      nome: dados.nome.trim(),
      obrigatorio: dados.obrigatorio ?? false,
      maxSelecoes: dados.maxSelecoes ?? 1,
      ativo: dados.ativo ?? true,
      pratoIds: dados.pratoIds ?? [],
      adicionalIds: dados.adicionalIds ?? [],
    });

    return expand(grupo);
  }

  async atualizar(id: number, dados: any) {
    const grupo = await GrupoAdicional.findByPk(id);

    if (!grupo) {
      throw new Error("Grupo de adicionais não encontrado.");
    }

    await grupo.update(dados);
    return expand(grupo);
  }

  async excluir(id: number) {
    const grupo = await GrupoAdicional.findByPk(id);

    if (!grupo) {
      throw new Error("Grupo de adicionais não encontrado.");
    }

    await grupo.destroy();
  }
}

export default new GrupoAdicionalService();
