import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import DeletarPratoController from "../../controllers/prato/deletar-prato";
import { authMiddleware, authorizeRoles } from "../../middlewares";

export default (router: Router): void => {
  router.delete(
    "/pratos/:id",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new DeletarPratoController())
  );
};
