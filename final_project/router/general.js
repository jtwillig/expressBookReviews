const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(Object.values(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.status(200).json(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return res.status(200).json(Object.values(books).filter(b => b.author === req.params.author));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  return res.status(200).json(Object.values(books).filter(b => b.title === req.params.title));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  return res.status(200).json(books[req.params.isbn].reviews);
});

const getAllBooks = async () => {
  const res = await axios.get('http://localhost:5000')
  return res.data;
}

const getBookByISBN = async (isbn) => {
  const res = await axios.get(`http://localhost:5000/isbn/${isbn}`)
  return res.data;
}

const getBooksByAuthor = async (author) => {
  const res = await axios.get(`http://localhost:5000/author/${author}`)
  return res.data;
}

const getBooksByTitle = async (title) => {
  const res = await axios.get(`http://localhost:5000/title/${title}`)
  return res.data;
}

// Uncomment below code to test Axios requests of server endpoints at startup
/*const testAxiosRequests = async () => {
  const allBooks = await getAllBooks();
  console.log({allBooks});
  const bookByISBN = await getBookByISBN(1);
  console.log({bookByISBN});
  const booksByAuthor = await getBooksByAuthor('Unknown');
  console.log({booksByAuthor});
  const booksByTitle = await getBooksByTitle('Pride and Prejudice');
  console.log({booksByTitle});
}

void testAxiosRequests();*/

module.exports.general = public_users;
