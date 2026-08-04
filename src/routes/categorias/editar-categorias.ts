import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import EditarCategoriaController from "@/controllers/categorias/editar-categorias";
import { authMiddleware, authorizeRoles } from "../../middlewares";

export default (router: Router): void => {
  router.put(
    "/categorias/:id",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new EditarCategoriaController())
  );
};