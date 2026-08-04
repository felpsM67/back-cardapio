import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import DeletarEntregadorController from "@/controllers/entregador/deletar-entregador";
import { authMiddleware, authorizeRoles } from "@/middlewares";

export default (router: Router): void => {
  router.delete(
    "/entregadores/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(new DeletarEntregadorController())
  );
};