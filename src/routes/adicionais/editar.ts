import { Router } from "express";

import adaptRoute from "@/adapters/express-route-adapter";
import Controller from "@/controllers/adicionais/editar";
import {
  authMiddleware,
  authorizeRoles,
} from "@/middlewares";

export default (router: Router): void => {
  router.put(
    "/adicionais/:id",
    // authMiddleware,
    // authorizeRoles(["Gerente"]),
    adaptRoute(new Controller()),
  );
};