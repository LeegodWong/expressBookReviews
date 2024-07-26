const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let _ = require('lodash')
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.query
    if (_.isEmpty(username)) {
        return res.status(404).json({ message: "please input your username" })
    } else if (_.isEmpty(password)) {
        return res.status(404).json({ message: "please input your password" })
    } else if (!isValid(username)) {
        return res.status(404).json({ message: "username already exists" })
    }
    users.push({ username: username, password: password })
    return res.status(200).json({ message: `success to register user:${username}` })
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.status(200).json({ items: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    let book = _.get(books, isbn, {})
    if (_.isEmpty(book)) {
        return res.status(404).json({ message: "can not find the book" })
    } else {
        return res.status(200).json({ book: book });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author
    let bookList = _.filter(books, (book) => {
        return book.author == author
    })
    if (_.isEmpty(bookList)) {
        return res.status(404).json({ message: "can not find the book" })
    } else {
        return res.status(200).json({ books: bookList });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let keyWord = req.params.title.toLowerCase()
    let bookList = _.filter(books, (book) => {
        return book.title.toLowerCase().includes(keyWord)
    })
    if (_.isEmpty(bookList)) {
        return res.status(404).json({ message: "can not find the book" })
    } else {
        return res.status(200).json({ books: bookList });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    let book = _.get(books, isbn, {})
    if (_.isEmpty(book)) {
        return res.status(404).json({ message: "can not find the book" })
    } else {
        let reviews = _.get(book, 'reviews', {})
        if (_.isEmpty(reviews)) {
            return res.status(404).json({ message: "can not find any reviews of this book" })
        } else {
            return res.status(200).json({ reviews: reviews });
        }
    }
});

module.exports.general = public_users;
