import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const REDIS_PORT: number = parseInt(
  process.env.REDIS_PORT || "6379",
  10
);
export const REDIS_HOST: string = process.env.REDIS_HOST || "127.0.0.1";
