import { Router } from "express";

import adaptRoute from "@/adapters/express-route-adapter";
import AlterarStatusCargoController from "@/controllers/cargos/alterar-status-cargo";
import { authMiddleware, authorizeRoles } from "@/middlewares";
import { validateBody } from "@/middlewares/validate-body";
import { alterarStatusCargoSchema } from "@/schemas";

export default (router: Router): void => {
  router.patch(
    "/cargos/:id/status",
    authMiddleware,
    authorizeRoles(["Gerente"]),
    validateBody(alterarStatusCargoSchema),
    adaptRoute(new AlterarStatusCargoController())
  );
};