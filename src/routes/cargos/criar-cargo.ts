import { Router } from "express";

import adaptRoute from "@/adapters/express-route-adapter";
import CriarCargoController from "@/controllers/cargos/criar-cargo";
import { authMiddleware, authorizeRoles } from "@/middlewares";
import { validateBody } from "@/middlewares/validate-body";
import { createCargoSchema } from "@/schemas";

export default (router: Router): void => {
  router.post(
    "/cargos",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    validateBody(createCargoSchema),
    adaptRoute(new CriarCargoController())
  );
};