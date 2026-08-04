import { Router } from "express";

import adaptRoute from "@/adapters/express-route-adapter";
import { authMiddleware, authorizeRoles } from "@/middlewares";
import ListarCargosController from "@/controllers/cargos/lista-cargo";
ListarCargosController

export default (router: Router): void => {
  router.get(
    "/cargos",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(new ListarCargosController())
  );
};