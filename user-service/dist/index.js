import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './route.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT;
// Middlewares
app.use(express.json());
// Routes
app.use('/api/v1', userRoutes);
const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected");
    }
    catch (error) {
        console.log('Error connecting to mongodb database', error);
    }
};
app.get('/', (req, res) => {
    return res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    connection();
});
//# sourceMappingURL=index.js.map