/** @format */

import express from 'express';
const router = express.Router();

// import controllers
import {
	createNotes,
	getNotes,
	updateNotes,
	deleteNote,
} from '../contollers/noteController.js';

//import middleware
import { userAuthentication } from '../middleware/authMiddleware.js';

router.post('/create-note', userAuthentication, createNotes);
router.get('/view-notes', userAuthentication, getNotes);
router.put('/update-notes/:id', userAuthentication, updateNotes);
router.delete('/delete-note/:id', userAuthentication, deleteNote);

export default router;
