import { Router } from "express";

import adaptRoute from "@/adapters/express-route-adapter";
import EditarCargoController from "@/controllers/cargos/editar-cargo";
import { authMiddleware, authorizeRoles } from "@/middlewares";
import { validateBody } from "@/middlewares/validate-body";
import { updateCargoSchema } from "@/schemas";

export default (router: Router): void => {
  router.put(
    "/cargos/:id",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    validateBody(updateCargoSchema),
    adaptRoute(new EditarCargoController())
  );
};