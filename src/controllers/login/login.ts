import { ok, serverError, unAuthorized } from "@/helpers/http-helper";
import { Controller, HttpRequest, HttpResponse } from "@/protocols";
import { LoginService } from "@/service/login-service";
import { LoginDTO } from "@/types";
export class LoginController implements Controller {
  constructor(private readonly loginService: LoginService) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const user = await this.loginService.login(httpRequest.body as LoginDTO);
      if (!user) return unAuthorized({ message: "E-mail ou senha inválidos." });
      const role = await this.loginService.resolverCargo(user);
      const tokens = this.loginService.gerarTokens(user, role);
      return ok({ message: "Login realizado com sucesso", ...tokens, user: { id: user.id, nome: user.nome, email: user.email, role } });
    } catch (error) { return serverError(error); }
  }
}
export default LoginController;
