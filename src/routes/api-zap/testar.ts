import { Router } from "express";

import adaptRoute from "../../adapters/express-route-adapter";

import { TestarZapiController } from "../../controllers/api-whats/zapi";

import {
  authMiddleware,
  authorizeRoles,
} from "../../middlewares";

export default (
  router: Router
): void => {
  router.post(
    "/zapi/testar",
    // authMiddleware,
    // authorizeRoles(["Gerente"]),
    adaptRoute(
      new TestarZapiController()
    )
  );
};