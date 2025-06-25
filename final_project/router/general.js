const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(typeof username !== "string" || username == ""){
        return res.status(400).json({message: "Username cannot be empty"});
    }
    if(!isValid(username)){
        return res.status(400).json({message: "User with the provided username already exists"});
    }
    if(typeof password !== "string" || password.length < 6){
        return res.status(400).json({message: "Password needs to be at least 6 characters long"});
    }
    const new_user = {
        'username': username,
        'password': password
    }
    users.push(new_user);
    return res.json({'message': "User has been created successfuly"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  return res.json(book || {'message': "No book found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const books_filtered = {};
    for(key in books){
        if(books[key].author === req.params.author){
            books_filtered[key] = books[key];
        }
    }
    return res.json({'books': books_filtered});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const books_filtered = {};
    for(key in books){
        if(books[key].title === req.params.title){
            books_filtered[key] = books[key];
        }
    }
    return res.json({'books': books_filtered});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const review = books[req.params.isbn]?.reviews;
    const resonse_data = {review};
    return res.json(review ? resonse_data : {'message': "No book found"});
});

module.exports.general = public_users;
