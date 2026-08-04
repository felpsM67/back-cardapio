import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import setupMiddlewares from "./middlewares";
import setupRoutes from "./routes";
import { resolveRuntimePath } from "./paths";
import { ENV } from "./env";
import { setupErrorHandlers } from "@/middlewares";
import { configureCatalogAssociations } from "@/models/catalogo-associations";

configureCatalogAssociations();

const app = express();

// Swagger opcional
if (ENV.SWAGGER_ENABLED) {
  const swaggerFile = resolveRuntimePath("docs/api/swagger.yaml");
  const swaggerDocument = YAML.load(swaggerFile);
  app.get("/", (_req, res) => res.redirect("/api-docs"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  app.get("/", (_req, res) => res.status(204).end());
}

// Middlewares **antes** das rotas
setupMiddlewares(app);

// Rotas
setupRoutes(app);
setupErrorHandlers(app);

export default app;
