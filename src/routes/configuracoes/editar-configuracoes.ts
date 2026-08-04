import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import { UpdateConfiguracoesController } from "@/controllers/configuracoes/editar-configuracoes";
import { authMiddleware, authorizeRoles } from "@/middlewares";

export default (router: Router): void => {
    router.put(
        "/configuracoes/:id",
        authMiddleware,
        authorizeRoles(["Gerente"]),
        adaptRoute(new UpdateConfiguracoesController())
    )
}
