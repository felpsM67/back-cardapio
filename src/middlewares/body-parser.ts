import {
  json,
  urlencoded,
  type RequestHandler,
} from "express";

const JSON_LIMIT =
  process.env.JSON_LIMIT ?? "5mb";

const URLENC_LIMIT =
  process.env.URLENC_LIMIT ?? "5mb";

const bodyParser: RequestHandler[] = [
  json({
    limit: JSON_LIMIT,
  }),

  urlencoded({
    extended: true,
    limit: URLENC_LIMIT,
  }),
];

export default bodyParser;