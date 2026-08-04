import sequelize from "@/database";
import { Encrypter } from "@/interfaces";
import Cargo from "@/models/cargo-model";
import Cliente from "@/models/cliente-model";
import Funcionario from "@/models/funcionario-model";
import Gerente from "@/models/gerente-model";
import User from "@/models/user-model";
import { CreateUserDTO, ResponseCreateUserDto } from "@/types";

export class UsuarioService {
  constructor(private readonly encrypter: Encrypter) {}

  async deletarUsuario(id: number): Promise<boolean> {
    return sequelize.transaction(async (transaction) => {
      const user = await User.findByPk(id, { transaction });
      if (!user) return false;
      await Cliente.destroy({ where: { userId: id }, transaction });
      await Funcionario.destroy({ where: { userId: id }, transaction });
      await Gerente.destroy({ where: { userId: id }, transaction });
      await user.destroy({ transaction });
      return true;
    });
  }

  async buscarUsuarioPorId(id: number) { return User.findByPk(id, { attributes: { exclude: ["senha"] } }); }
  async buscarPorEmail(email: string) { return User.findOne({ where: { email } }); }
  async buscaTodosUsuarios() { return User.findAll({ attributes: { exclude: ["senha"] } }); }

  async atualizarUsuario(id: number, dados: { nome?: string; email?: string; senha?: string }) {
    const user = await User.findByPk(id);
    if (!user) return null;
    const update: any = {};
    if (dados.nome) update.nome = dados.nome;
    if (dados.email) update.email = dados.email.toLowerCase();
    if (dados.senha) update.senha = await this.encrypter.hash(dados.senha);
    await user.update(update);
    await Cliente.update({ nome: dados.nome }, { where: { userId: id } });
    await Funcionario.update({ nome: dados.nome }, { where: { userId: id } });
    await Gerente.update({ nome: dados.nome }, { where: { userId: id } });
    return user;
  }

  async criarUsuario(dados: CreateUserDTO): Promise<ResponseCreateUserDto> {
    const exists = await User.findOne({ where: { email: dados.email.toLowerCase() } });
    if (exists) throw new Error("E-mail já cadastrado.");
    return sequelize.transaction(async (transaction) => {
      const senha = await this.encrypter.hash(dados.senha);
      const role = dados.role === "Entregador" ? "Funcionario" : dados.role;
      const user = await User.create({ nome: dados.nome, email: dados.email.toLowerCase(), senha, role }, { transaction });
      if (role === "Cliente") {
        await Cliente.create({ nome: dados.nome, telefone: dados.telefone, endereco: null, userId: user.id }, { transaction });
      } else if (role === "Gerente") {
        await Gerente.create({ nome: dados.nome, telefone: dados.telefone, userId: user.id }, { transaction });
      } else {
        const [cargo] = await Cargo.findOrCreate({ where: { nome: "Caixa" }, defaults: { nome: "Caixa", descricao: "Atendimento de pedidos", permissoes: ["view_orders", "manage_orders"], ativo: true }, transaction });
        await Funcionario.create({ nome: dados.nome, telefone: dados.telefone ?? null, ativo: true, userId: user.id, cargoId: cargo.id }, { transaction });
      }
      return { id: user.id, nome: user.nome, email: user.email, role: user.role, telefone: dados.telefone };
    });
  }

  async __buscarPerfilPorUserId(userId: number) {
    const user = await User.findByPk(userId);
    if (!user) return null;
    if (user.role === "Cliente") return Cliente.findOne({ where: { userId }, include: [{ model: User, as: "user" }] });
    if (user.role === "Gerente") return Gerente.findOne({ where: { userId }, include: [{ model: User, as: "user" }] });
    return Funcionario.findOne({ where: { userId }, include: [{ model: User, as: "user" }, { model: Cargo, as: "cargo" }] });
  }
  async validarUsuarioExistente(id: number) { return Boolean(await User.findByPk(id)); }
}
