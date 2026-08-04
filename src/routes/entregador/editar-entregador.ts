import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import EditarEntregadorController from "@/controllers/entregador/editar-entregador";
import { authMiddleware, authorizeRoles } from "@/middlewares";

export default (router: Router): void => {
  router.put(
    "/entregadores/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(new EditarEntregadorController())
  );
};