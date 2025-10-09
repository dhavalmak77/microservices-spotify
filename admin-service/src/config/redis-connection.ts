import dotenv from "dotenv"; 
import redis from "redis";

dotenv.config();

export const redisClient = redis.createClient({
	password: process.env.REDIS_PASSWORD as string,
	socket: {
		host: process.env.REDIS_HOST as string,
		port: Number(process.env.REDIS_PORT as string)
	}
});