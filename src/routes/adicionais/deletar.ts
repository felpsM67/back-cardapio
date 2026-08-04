import { Router } from "express";

import adaptRoute from "@/adapters/express-route-adapter";
import Controller from "@/controllers/adicionais/deletar";
import {
  authMiddleware,
  authorizeRoles,
} from "@/middlewares";

export default (router: Router): void => {
  router.delete(
    "/adicionais/:id",
    // authMiddleware,
    // authorizeRoles(["Gerente"]),
    adaptRoute(new Controller()),
  );
};