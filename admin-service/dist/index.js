import express from "express";
import dotenv from "dotenv";
import { psql } from "./config/database.js";
import adminRoutes from "./route.js";
import cloudinary from "cloudinary";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
// Middleware
app.use(express.json());
// Routes
app.use('/api/v1', adminRoutes);
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_API_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const initSchema = async () => {
    try {
        await psql `
			CREATE TABLE IF NOT EXISTS albums(
				id SERIAL PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				description VARCHAR(255) NOT NULL,
				thumbnail VARCHAR(255) NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;
        await psql `
			CREATE TABLE IF NOT EXISTS songs(
				id SERIAL PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				description VARCHAR(255) NOT NULL,
				thumbnail VARCHAR(255),
				audio VARCHAR(255) NOT NULL,
				album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`;
        console.log("Database tables initialized successfully");
    }
    catch (error) {
        console.error("Error intializing database tables:", error);
    }
};
initSchema().then(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
//# sourceMappingURL=index.js.map