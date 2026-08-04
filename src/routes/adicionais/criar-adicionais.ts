import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import { CriarAdicionaisController } from "@/controllers/adicionais/criar-adicionais";
import { authMiddleware, authorizeRoles } from "@/middlewares";

export default (router: Router): void => {
  router.post(
    "/adicionais",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(new CriarAdicionaisController())
  );
};