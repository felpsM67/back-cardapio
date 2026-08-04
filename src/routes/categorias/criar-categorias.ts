import { Router } from "express";
import adaptRoute from "@/adapters/express-route-adapter";
import { CriarCategoriaController } from "@/controllers/categorias/cria-categorias";
import { authMiddleware, authorizeRoles } from "@/middlewares";

export default ( router: Router): void => {
    router.post(
        "/categorias",
        authMiddleware,
        authorizeRoles(["Gerente"]),
        adaptRoute(new CriarCategoriaController())
    )
}