import { Tokenizer } from "@/adapters/token-adapter";
import { Encrypter } from "@/interfaces";
import Cargo from "@/models/cargo-model";
import Funcionario from "@/models/funcionario-model";
import User from "@/models/user-model";
import { LoginDTO } from "@/types";

export class LoginService {
  constructor(private readonly encrypter: Encrypter, private readonly tokenizer: Tokenizer) {}

  async login({ email, senha }: LoginDTO): Promise<User | null> {
    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user || !(await this.encrypter.compare(senha, user.senha))) return null;
    return user;
  }

  async resolverCargo(user: User): Promise<string> {
    if (user.role === "Gerente") return "Gerente";
    if (user.role !== "Funcionario") return user.role;
    const funcionario = await Funcionario.findOne({
      where: { userId: user.id },
      include: [{ model: Cargo, as: "cargo" }],
    });
    return (funcionario as any)?.cargo?.nome ?? "Funcionario";
  }

  gerarTokens(user: User, role: string) {
    const payload = { id: user.id, sub: String(user.id), email: user.email, role };
    return {
      token: this.tokenizer.generateToken(payload),
      refreshToken: this.tokenizer.generateRefreshToken({ id: user.id, sub: String(user.id) }),
    };
  }
}
