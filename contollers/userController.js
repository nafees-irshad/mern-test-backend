/** @format */

import User from '../models/usersModel.js';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

//user registration endpoint
export const userRegistration = async (req, res) => {
	const { name, email, password } = req.body;
	console.log(req.body);
	try {
		//check if user exists or not
		const user = await User.findOne({ email: email });
		if (user) {
			return res.status(400).json({
				status: 'failed',
				message: 'Email already exists',
			});
		}
		//hash password
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(password, salt);

		//create new User
		const newUser = new User({
			name,
			email,
			password: hashPassword,
		});
		//save user details
		await newUser.save();
		res.status(201).json({
			status: 'success',
			message: 'Email registered successfully',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json('Error registering user');
	}
};

//login
export const userLogin = async (req, res) => {
	const { email, password } = req.body;
	console.log(req.body)
	try {
		//check if user email exist
		const user = await User.findOne({ email: email });
		if (!user) {
			return res.status(400).json({
				status: 'failed',
				message: 'Email not found',
			});
		}
		//validating password
		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(400).json({
				status: 'failed',
				message: 'Invalid credentials',
			});
		}
		//generate token
		const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
			expiresIn: '5d',
		});
		res.status(200).json({
			status: 'success',
			message: 'Login successful',
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json('Login error');
	}
};
