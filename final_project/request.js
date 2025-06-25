const axios = require('axios')


const baseUrl = "https://mert123-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai";

// TASK 10
const getBooks = async ()=>{
    const books = await axios.get(`${baseUrl}/`);
    return books.data;
};

getBooks().then(books => {
    console.log(books);
});

// TASK 11
const getBookByISBN = async (isbn)=>{
    const book = await axios.get(`${baseUrl}/isbn/${isbn}`);
    return book.data;
}

getBookByISBN(1).then(book => {
    console.log(book);
})

// TASK 12
const getBooksByAuthor = async (author)=>{
    const books = await axios.get(`${baseUrl}/author/${author}`);
    return books.data;
}

getBooksByAuthor("Samuel Beckett").then(books => {
    console.log(books);
})

// TASK 13
const getBookByTitel = async (title)=>{
    const books = await axios.get(`${baseUrl}/title/${title}`);
    return books.data;
}

getBookByTitel("The Divine Comedy").then(books => {
    console.log(books);
}).catch(err => {
    console.error(err);
})