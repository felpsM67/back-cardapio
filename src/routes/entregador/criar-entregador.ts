import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import { authMiddleware, authorizeRoles } from "@/middlewares";
import { CriarEntregadorController } from "@/controllers/entregador/criar-entregador";

export default (router: Router): void => {
  router.post(
    "/entregadores",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(new CriarEntregadorController())
  );
};