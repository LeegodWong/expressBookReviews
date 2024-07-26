const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
let _ = require('lodash')

const regd_users = express.Router();

let users = [
    { username: 'test-1', password: '1111' },
    { username: 'test-2', password: '2222' },
    { username: 'test-3', password: '123' },
];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    let isExisted = false
    for (const user of users) {
        if (user.username == username) {
            isExisted = true
            return
        }
    }
    return !isExisted
}

const authenticatedUser = (username, password) => { //returns boolean
    let user = null
    for (const u of users) {
        if (u.username == username && u.password == password) {
            user = u
            return user
        }
    }
    return user
    //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const { username, password } = req.body
    let user = authenticatedUser(username, password)
    if (_.isEmpty(user)) {
        return res.status(404).json({ message: "Invalid username or password" })
    } else {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ ...user, accessToken: accessToken });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn
    let book = _.get(books, isbn, {})
    let reviews = _.get(book, 'reviews', {})
    let newReview = _.get(req, 'query.review', '')
    let username = req.session.authorization.username
    reviews = {
        ...reviews,
        [username]: newReview,
    }
    _.set(book, 'reviews', reviews)
    return res.status(200).json({ book: book });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn
    let book = _.get(books, isbn, {})
    let reviews = _.get(book, 'reviews', {})
    let currUser = req.session.authorization.username
    let newReviewList = {}
    _.forEach(reviews, (review, user) => {
        if (user != currUser) {
            _.set(newReviewList, user, review)
        }
    })
    _.set(book, 'reviews', newReviewList)
    return res.status(200).json({ book: book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
