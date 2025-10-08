import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1', songRoutes);

app.listen(PORT, () => {
	console.log(`Server listening at port ${PORT}`);
});