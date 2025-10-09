import express from "express";
import dotenv from "dotenv";
import adminRoutes from "./route.js";
import cloudinary from "cloudinary";
import { initSchema } from "./config/initialize-schema.js";
import { redisClient } from "./config/redis-connection.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use('/api/v1', adminRoutes);
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
initSchema().then(() => {
    app.listen(PORT, async () => {
        console.log(`Server listening on port ${PORT}`);
        // Redis connection
        try {
            await redisClient.connect();
            console.log('Redis connected');
        }
        catch (err) {
            console.log('Error in connecting to redis', err);
        }
    });
});
//# sourceMappingURL=index.js.map