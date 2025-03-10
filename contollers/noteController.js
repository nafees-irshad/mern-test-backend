/** @format */

import Note from '../models/notesModel.js';

export const createNotes = async (req, res) => {
	try {
		const { title, content } = req.body;
		// console.log(req.body);

		// Check if user is authenticated
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized. Please log in.' });
		}

		// Validate input
		if (!title || !content) {
			return res
				.status(400)
				.json({ message: 'Title and content are required.' });
		}

		// Create a new note and associate it with the logged-in user
		const newNote = new Note({
			title,
			content,
			owner: req.user.id, // Assign owner from logged-in user
		});

		await newNote.save();

		res
			.status(201)
			.json({ message: 'Note created successfully', note: newNote });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

export const getNotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default page = 1
        const limit = parseInt(req.query.limit) || 10; // Default limit = 10

        const skip = (page - 1) * limit; // Calculate the number of documents to skip

        // Get paginated notes for the logged-in user
        const notes = await Note.find({ owner: req.user.id })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by newest first

        // Get total note count
        const totalNotes = await Note.countDocuments({ owner: req.user.id });

        res.json({
            page,
            limit,
            totalPages: Math.ceil(totalNotes / limit),
            totalNotes,
            notes,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const updateNotes = async (req, res) => {
	const { id } = req.params;
	const { title, content } = req.body;
	try {
		//validate input fields
		if (title !== undefined && title.trim() === '') {
			return res.status(400).json({
				status: 'failed',
				message: 'Title is required',
			});
		}
		if (content !== undefined && content.trim() === '') {
			return res.status(400).json({
				status: 'failed',
				message: 'content is required',
			});
		}
		// Find the note by ID
		const note = await Note.findById(id);

		// Check if the note exists
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}
		// Check if the logged-in user is the owner of the note
		if (note.owner.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ message: 'Not authorized to update this note' });
		}

		// Update the note
		note.title = title || note.title;
		note.content = content || note.content;
		await note.save();

		res.status(200).json({ message: 'Note updated successfully', note });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

export const deleteNote = async (req, res) => {
	const { id } = req.params;
	try {
		// Find the note by ID
		const note = await Note.findById(id);
		// Check if the note exists
		if (!note) {
			return res.status(404).json({ message: 'Note not found' });
		}
		// Check if the logged-in user is the owner of the notee
		if (note.owner.toString() !== req.user.id) {
			return res
				.status(403)
				.json({ message: 'Not authorized to update this note' });
		}
		// Delete the note
		await note.deleteOne();
		res.status(200).json({ message: 'Note deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
