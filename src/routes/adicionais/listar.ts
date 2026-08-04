import { Router } from "express";

import adaptRoute from "@/adapters/express-route-adapter";
import Controller from "@/controllers/adicionais/listar";

export default (router: Router): void => {
  router.get(
    "/adicionais",
    adaptRoute(new Controller()),
  );
};