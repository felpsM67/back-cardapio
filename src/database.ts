import { Sequelize } from "sequelize";

import { ENV } from "@/config/env";

const isTest = ENV.NODE_ENV === "test";
const databaseUrl = process.env.DATABASE_URL;

if (!isTest && !databaseUrl) {
  throw new Error(
    "A variável DATABASE_URL não foi configurada no .env.",
  );
}

const sequelize = isTest
  ? new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    })
  : new Sequelize(databaseUrl as string, {
      dialect: "postgres",

      logging:
        ENV.NODE_ENV === "development"
          ? console.log
          : false,

      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },

      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });

export default sequelize;