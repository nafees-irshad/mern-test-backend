/** @format */

import JWT from 'jsonwebtoken';
import User from '../models/usersModel.js';
import dotenv from 'dotenv';

dotenv.config();

export const userAuthentication = async (req, res, next) => {
	try {
		//getting authorization from req headers
		const { authorization } = req.headers;

		//checking if token is present in headers with formate
		if (!(authorization && authorization.startsWith('Bearer'))) {
			return res.status(401).json({
				status: 'failed',
				message: 'Unauthorized User, No Token',
			});
		}
		//extracting token from headers
		const token = authorization.split(' ')[1];

		//verifying token using secret key
		const { userId } = JWT.verify(token, process.env.JWT_SECRET_KEY);

		//finding user from database using userId
		req.user = await User.findById(userId).select(-'password');

		//if user is found then call next function
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			status: 'failed',
			message: 'Authentication failed',
		});
	}
};
