const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return users.find(e => e.username == username) == null;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.find(e=> e.username === username && e.password === password) != null;
}

const jwt_secret = "access";

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(authenticatedUser(username, password)){
        const user = users.find(e => e.username == username);
        const accessToken = jwt.sign(user, jwt_secret, { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        req.session.save(function (err) {
            if (err) return next(err)
            return res.status(200).send("User successfully logged in");
        })
        
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    const review = req.body.review;
    if(book && review){
        book.reviews[req.user.username] = review;
        return res.json({'message': "Review posted"});
    }
    return res.status(300).json({message: "Error: Review couldn't be saved"});
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const book = books[req.params.isbn];
    if(book){
        delete book.reviews[req.user.username];
        return res.json({'message': "Review deleted"});
    }
    return res.status(300).json({message: "Error: Review couldn't be deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
