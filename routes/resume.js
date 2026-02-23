import express from 'express';
import Resume from '../models/Resume.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get User's Resume (Assuming single resume for now or list)
router.get('/', auth, async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id });
        res.json(resumes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create or Update Resume
// For simplicity, we might just update the "current" resume or create new
router.post('/', auth, async (req, res) => {
    try {
        // Check if resume exists for simplicity in this demo, or just create new
        // The requirement says "saved resumes list", so create new is better.
        // If ID provided, update.

        const { _id, ...resumeData } = req.body;

        if (_id) {
            const updatedResume = await Resume.findByIdAndUpdate(_id, resumeData, { new: true });
            return res.json(updatedResume);
        }

        const newResume = new Resume({
            ...resumeData,
            user: req.user.id
        });
        const savedResume = await newResume.save();
        res.json(savedResume);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Resume
router.delete('/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json({ message: 'Resume deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get specific resume
router.get('/:id', auth, async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
        if (!resume) return res.status(404).json({ message: 'Resume not found' });
        res.json(resume);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
