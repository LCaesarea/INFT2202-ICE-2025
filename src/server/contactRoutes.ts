import express from 'express';
import Database from './database';
import { ObjectId } from 'mongodb';

const router = express.Router();

// MongoDB Collection Name
const COLLECTION_NAME = 'contacts';

// Routes
router.get('/', async (req, res) => {
    try {
        const db = await Database.connect();
        const contacts = await db.collection(COLLECTION_NAME).find().toArray();
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contacts' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const db = await Database.connect();
        const contact = await db.collection(COLLECTION_NAME).findOne({
            _id: new ObjectId(req.params.id)
        });

        if (contact) {
            res.json(contact);
        } else {
            res.status(404).json({ message: 'Contact not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching contact' });
    }
});

router.post('/', async (req, res) => {
    try {
        const db = await Database.connect();
        const result = await db.collection(COLLECTION_NAME).insertOne(req.body);
        const newContact = { ...req.body, _id: result.insertedId };
        res.status(201).json(newContact);
    } catch (error) {
        res.status(500).json({ message: 'Error creating contact' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const db = await Database.connect();
        const result = await db.collection(COLLECTION_NAME).updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ message: 'Contact not found' });
        } else {
            res.json({ ...req.body, _id: req.params.id });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const db = await Database.connect();
        const result = await db.collection(COLLECTION_NAME).deleteOne({
            _id: new ObjectId(req.params.id)
        });

        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Contact not found' });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact' });
    }
});

export default router;