import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import EditarAdicioanisController from "@/controllers/adicionais/editar-adicionais";
import { authMiddleware, authorizeRoles } from "@/middlewares";

export default (router: Router): void => {
  router.put(
    "/adicionais/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(new EditarAdicioanisController())
  );
};