import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import ListaEntregadorController from "@/controllers/entregador/listar-entregador";

export default (router: Router): void => {
  router.get(
  "/entregadores",
  adaptRoute(new ListaEntregadorController())
    );
};
