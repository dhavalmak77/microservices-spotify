import dotenv from "dotenv";
import redis from "redis";
dotenv.config();
export const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});
//# sourceMappingURL=redis-connection.js.map