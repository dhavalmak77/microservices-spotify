import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import { redisClient } from "./config/redis-connection.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
// Middleware
app.use(express.json());
// Routes
app.use('/api/v1', songRoutes);
app.listen(PORT, async () => {
    console.log(`Server listening at port ${PORT}`);
    // Redis connection
    try {
        await redisClient.connect();
        console.log('Redis connected');
    }
    catch (err) {
        console.log('Error in connecting to redis', err);
    }
});
//# sourceMappingURL=index.js.map