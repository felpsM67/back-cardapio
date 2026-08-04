import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import ListarPratoController from "../../controllers/prato/listar-prato";

export default (router: Router): void => {
  router.get("/pratos{/:id}", adaptRoute(new ListarPratoController()));
};
