import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL as string);
        console.log("Database connected");
    } catch (error) {
        console.log('Error connecting to mongodb database', error);
    }
};

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    connection();
});