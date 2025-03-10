/** @format */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDb = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URL);
        // console.log("Database URL:", process.env.DATABASE_URL);
		console.log('MongoDB connected');
	} catch (err) {
		console.log(err.message);
	}
};

export default connectDb;
