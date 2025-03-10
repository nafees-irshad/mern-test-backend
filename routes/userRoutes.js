/** @format */

import express from 'express';
const router = express.Router();

// import controllers
import { userRegistration, userLogin } from '../contollers/userController.js';

router.post('/register', userRegistration);
router.post('/login', userLogin);

export default router;
