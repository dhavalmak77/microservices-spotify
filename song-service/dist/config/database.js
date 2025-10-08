import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
dotenv.config();
export const psql = neon(process.env.POSTGRES_URL);
//# sourceMappingURL=database.js.map