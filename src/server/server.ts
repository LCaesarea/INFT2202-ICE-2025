const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// API Routes
app.use('/api/contacts', contactRoutes);

// Static files
app.use(express.static(path.join(__dirname, '../../dist/client')));
app.use(express.static(path.join(__dirname, '../..'))); // For index.html, content/, views/

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});import express from 'express';
import path from 'path';
import contactRoutes from './contactRoutes';
import Database from './database';

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// API Routes
app.use('/api/contacts', contactRoutes);

// Static files
app.use(express.static(path.join(__dirname, '../../dist/client')));
app.use(express.static(path.join(__dirname, '../..')));

// Connect to MongoDB before starting server
Database.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });