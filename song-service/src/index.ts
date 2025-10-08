import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import redis from "redis";

dotenv.config();

export const redisClient = redis.createClient({
	password: process.env.REDIS_PASSWORD as string,
	socket: {
		host: process.env.REDIS_HOST as string,
		port: Number(process.env.REDIS_PORT as string)
	}
});

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1', songRoutes);

app.listen(PORT, () => {
	console.log(`Server listening at port ${PORT}`);
});