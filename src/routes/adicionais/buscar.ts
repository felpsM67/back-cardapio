import { Router } from "express";

import adaptRoute from "@/adapters/express-route-adapter";
import Controller from "@/controllers/adicionais/buscar";

export default (router: Router): void => {
  router.get("/adicionais/:id", adaptRoute(new Controller()));
};