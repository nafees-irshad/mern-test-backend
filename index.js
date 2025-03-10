/** @format */

import express from 'express';
import limiter from './middlewares/rateLimiter.js';
import connectDb from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';

//import routes
//user routes
import userRoutes from './routes/userRoutes.js';

//notes routes
import notesRoutes from './routes/noteRoutes.js';

dotenv.config();
const app = express();
app.use(
	cors({
		origin: 'http://localhost:3000', // Allow requests from your React frontend
		credentials: true, // Allow cookies (if needed)
	})
);
app.use(limiter);
app.use(express.json()); // Middleware for parsing JSON

connectDb();

//use routes
app.use('/api/users', userRoutes);

app.use('/api/notes', notesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
