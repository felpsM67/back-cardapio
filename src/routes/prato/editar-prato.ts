import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import EditarPratoController from "../../controllers/prato/editar-prato";
import { authMiddleware, authorizeRoles } from "../../middlewares";

export default (router: Router): void => {
  router.put(
    "/pratos/:id",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new EditarPratoController())
  );
};
