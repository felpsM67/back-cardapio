import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import { CriarConfiguracoesController } from "@/controllers/configuracoes/criar-configuracoes";
import { authMiddleware, authorizeRoles } from "../../middlewares";

export default (router: Router): void => {
    router.post(
      "/configuracoes",
      authMiddleware,
      authorizeRoles(["Gerente", "Funcionario"]),
      adaptRoute(new ( CriarConfiguracoesController ))
    )
}