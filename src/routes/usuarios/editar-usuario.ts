import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import EditarUsuarioController from "../../controllers/usuario/editar-usuario";
import { authMiddleware, authorizeRoles } from "../../middlewares";

export default (router: Router): void => {
  router.put(
    "/users/:id",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new EditarUsuarioController())
  );
};
