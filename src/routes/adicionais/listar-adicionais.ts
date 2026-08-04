import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import ListarAdicionaisController from "@/controllers/adicionais/listar-adicionais";
import { authMiddleware } from "@/middlewares";

export default (router: Router): void => {
  router.get(
    "/adicionais",
    authMiddleware,
    adaptRoute(new ListarAdicionaisController())
  );
};