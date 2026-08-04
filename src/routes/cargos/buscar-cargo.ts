import { Router } from "express";

import adaptRoute from "@/adapters/express-route-adapter";
import BuscarCargoIdController from "@/controllers/cargos/buscar-cargo";
import { authMiddleware, authorizeRoles } from "@/middlewares";

export default (router: Router): void => {
  router.get(
    "/cargos/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    adaptRoute(new BuscarCargoIdController())
  );
};