import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import ListaCategoriasController from "@/controllers/categorias/listar-categoria";
export default (router: Router): void => {
  router.get("/categorias{/:id}",
    adaptRoute
    (new ListaCategoriasController()));
};
