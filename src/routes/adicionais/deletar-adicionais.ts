import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import DeletarAdicionaisController from "@/controllers/adicionais/deletar-adicionais";
import { authMiddleware, authorizeRoles } from "@/middlewares";

export default (router: Router): void => {
  router.delete(
    "/adicionais/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(new DeletarAdicionaisController())
  );
};