import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import { ListarPedidoController } from "@/controllers/pedido/listar-pedido";
import { authMiddleware, authorizeRoles } from "@/middlewares";

export default (router: Router): void => {
  router.get(
    "/pedidos",
    authMiddleware,
    authorizeRoles(["Gerente", "Funcionario"]),
    adaptRoute(new ListarPedidoController())
  );
};
