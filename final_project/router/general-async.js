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

const getBooks = ()=> {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(books);
        }, 100);
    });
};

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const book_list = await getBooks();
        return res.json({'books': book_list});
    }catch(error){
        console.error(error);
        res.status(500).json({'message': "Unable to retrive books"});
    }
});

const getBookByISBN = (isbn)=> {
    return new Promise((res, rej) => {
        setTimeout(() => {
            if(books[isbn]){
                res(books[isbn]);
            }
            else{
                rej("No book found")
            }
        }, 100);
    });
};
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const book = await getBookByISBN(req.params.isbn);
        return res.json(book || {'message': "No book found"});
    }catch(error){
        console.error(error);
        res.status(500).json({'message': "Unable to retrive books"});
    }
 });

const getBooksByAuthor = (author)=> {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const books_filtered = {};
            for(key in books){
                if(books[key].author === author){
                    books_filtered[key] = books[key];
                }
            }
            res(books_filtered);
        }, 100);
    });
};
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const books_filtered = await getBooksByAuthor(req.params.author);
        return res.json({'books': books_filtered});
    }
    catch(error){
        console.error(error);
        res.status(500).json({'message': "Unable to retrive books"});
    }
});

const getBooksByTitle = (title)=> {
    return new Promise((res, rej) => {
        setTimeout(() => {
            const books_filtered = {};
            for(key in books){
                if(books[key].title === title){
                    books_filtered[key] = books[key];
                }
            }
            res(books_filtered);
        }, 100);
    });
};

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const books_filtered = await getBooksByTitle(req.params.title);
        return res.json({'books': books_filtered});
    }
    catch(error){
        console.error(error);
        res.status(500).json({'message': "Unable to retrive books"});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const review = books[req.params.isbn]?.reviews;
    const resonse_data = {review};
    return res.json(review ? resonse_data : {'message': "No book found"});
});

module.exports.general = public_users;
