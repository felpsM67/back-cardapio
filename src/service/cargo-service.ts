import Cargo from "@/models/cargo-model";
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

    if (
      dados.nome !== undefined &&
      dados.nome.trim() !== cargo.nome
    ) {
      const cargoExistente = await Cargo.findOne({
        where: {
          nome: dados.nome.trim(),
        },
      });

      if (cargoExistente && cargoExistente.id !== id) {
        throw new Error(
          "Já existe outro cargo com este nome.",
        );
      }
    }

    await cargo.update({
      nome:
        dados.nome !== undefined
          ? dados.nome.trim()
          : cargo.nome,

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

    cargo.ativo = ativo;

    await cargo.save();

    return cargo;
  }

  async excluir(id: number): Promise<void> {
    const cargo = await this.buscarPorId(id);

    await cargo.destroy();
  }
}

export default new CargoService();