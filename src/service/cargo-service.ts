import { Op } from "sequelize";

import Cargo from "@/models/cargo-model";
import Funcionario from "@/models/funcionario-model";

import type {
  CreateCargoDTO,
  UpdateCargoDTO,
} from "@/types/cargos";

class CargoService {
  async listar(apenasAtivos = false): Promise<Cargo[]> {
    return Cargo.findAll({
      where: apenasAtivos
        ? {
            ativo: true,
          }
        : undefined,

      order: [["nome", "ASC"]],
    });
  }

  async buscarPorId(id: number): Promise<Cargo> {
    const cargo = await Cargo.findByPk(id);

    if (!cargo) {
      throw new Error("Cargo não encontrado.");
    }

    return cargo;
  }

  async criar(dados: CreateCargoDTO): Promise<Cargo> {
    const nome = dados.nome.trim();

    if (!nome) {
      throw new Error("O nome do cargo é obrigatório.");
    }

    const cargoExistente = await Cargo.findOne({
      where: {
        nome,
      },
    });

    if (cargoExistente) {
      throw new Error("Já existe um cargo com este nome.");
    }

    return Cargo.create({
      nome,
      descricao: dados.descricao?.trim() || null,
      permissoes: dados.permissoes ?? [],
      ativo: dados.ativo ?? true,
    });
  }

  async atualizar(
    id: number,
    dados: UpdateCargoDTO,
  ): Promise<Cargo> {
    const cargo = await this.buscarPorId(id);

    let nome = cargo.nome;

    if (dados.nome !== undefined) {
      nome = dados.nome.trim();

      if (!nome) {
        throw new Error("O nome do cargo é obrigatório.");
      }

      const cargoExistente = await Cargo.findOne({
        where: {
          nome,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (cargoExistente) {
        throw new Error(
          "Já existe outro cargo com este nome.",
        );
      }
    }

    await cargo.update({
      nome,

      descricao:
        dados.descricao !== undefined
          ? dados.descricao?.trim() || null
          : cargo.descricao,

      permissoes:
        dados.permissoes !== undefined
          ? dados.permissoes
          : cargo.permissoes,

      ativo:
        dados.ativo !== undefined
          ? dados.ativo
          : cargo.ativo,
    });

    return cargo;
  }

  async alterarStatus(
    id: number,
    ativo: boolean,
  ): Promise<Cargo> {
    const cargo = await this.buscarPorId(id);

    await cargo.update({
      ativo,
    });

    return cargo;
  }

  async excluir(id: number): Promise<void> {
    const cargo = await this.buscarPorId(id);

    const funcionariosVinculados =
      await Funcionario.count({
        where: {
          cargoId: id,
        },
      });

    if (funcionariosVinculados > 0) {
      throw new Error(
        "Não é possível excluir um cargo vinculado a funcionários.",
      );
    }

    await cargo.destroy();
  }
}

export default new CargoService();