
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();

// Internal data endpoint
public_users.get('/data/books', (req, res) => {
    return res.status(200).json(books);
});

// Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: 'User successfully registered. Please login.'
    });
});

// Get all books using Axios
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/data/books');
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get book by ID
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/data/books');
        const book = response.data[req.params.isbn];

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/data/books');
        const author = req.params.author.toLowerCase();

        const result = Object.values(response.data).filter(
            book => book.author.toLowerCase() === author
        );

        if (!result.length) {
            return res.status(404).json({ message: 'No books found for this author' });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/data/books');
        const title = req.params.title.toLowerCase();

        const result = Object.values(response.data).filter(
            book => book.title.toLowerCase() === title
        );

        if (!result.length) {
            return res.status(404).json({ message: 'No books found with this title' });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get book reviews
public_users.get('/review/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/data/books');
        const book = response.data[req.params.isbn];

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json(book.reviews);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports.general = public_users;
