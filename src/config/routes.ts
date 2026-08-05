import { Express, Router } from "express";
import fg from "fast-glob";
import path from "node:path";

export default (app: Express): void => {
  const router = Router();

  app.use("/api", router);

  const routesDir = path.resolve(
    __dirname,
    "../routes",
  );

  const patterns =
    process.env.NODE_ENV === "production"
      ? ["**/*.{js,cjs}"]
      : ["**/*.{js,cjs,ts}"];

  const files = fg.sync(patterns, {
    cwd: routesDir,
    absolute: true,
  });

  console.log(`[routes] Diretório: ${routesDir}`);
  console.log(
    `[routes] Arquivos encontrados: ${files.length}`,
  );

  for (const file of files) {
    if (file.endsWith(".d.ts")) {
      continue;
    }

    const moduleRoute = require(file);
    const mount =
      moduleRoute.default ?? moduleRoute;

    if (typeof mount === "function") {
      mount(router);
    } else {
      console.warn(
        `[routes] ${path.basename(
          file,
        )} não exporta uma função padrão.`,
      );
    }
  }
};