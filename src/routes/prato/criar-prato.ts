import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import { CriarPratoController } from "../../controllers/prato/criar-prato";
import { authMiddleware, authorizeRoles } from "../../middlewares";

export default (router: Router): void => {
  router.post(
    "/pratos",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new CriarPratoController())
  );
};
