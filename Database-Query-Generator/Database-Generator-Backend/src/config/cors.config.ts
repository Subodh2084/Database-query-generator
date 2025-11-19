import cors, { CorsOptions } from "cors";

const corsConfig = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
} as CorsOptions;

export default corsConfig;
