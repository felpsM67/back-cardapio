import type { Request, Response } from "express";

import app from "@/config/app";
import sequelize from "@/database";
import { initializeDatabaseAndServer } from "@/config/initializeDatabaseAndServer";
let initializationPromise: Promise<void> | null = null;

function initializeDatabase(): Promise<void> {
  if (!initializationPromise) {
    initializationPromise =
      initializeDatabaseAndServer(sequelize).catch(
        (error) => {
          initializationPromise = null;
          throw error;
        },
      );
  }

  return initializationPromise;
}

export default async function handler(
  request: Request,
  response: Response,
): Promise<void> {
  try {
    await initializeDatabase();

    app(request, response);
  } catch (error) {
    console.error(
      "Falha ao inicializar API na Vercel:",
      error,
    );

    if (!response.headersSent) {
      response.status(500).json({
        message: "Falha ao inicializar a API.",
      });
    }
  }
}