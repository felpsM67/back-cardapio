import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import DeletarCategoriaController from "@/controllers/categorias/deletar-categoria";
import { authMiddleware, authorizeRoles } from "../../middlewares";

export default (router: Router): void => {
  router.delete(
    "/categorias/:id",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new DeletarCategoriaController())
  );
};