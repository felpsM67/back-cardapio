import { Router } from "express";
import adaptRoute from "../../adapters/express-route-adapter";
import { LoginControllerFactory } from "@/factories/controller/login/login-controller-factory";

export default (router: Router): void => {
  router.post("/login", adaptRoute(LoginControllerFactory()));
};
