const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
}

const authenticatedUser = (username, password) => {
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn]
  if(!book)
    return res.status(404).json({ message: "Book not found." });
  if(req.query.text) {
    book.reviews = {...book.reviews, [req.user.username]: req.query.text};
    return res.status(200).json({message: "Review added successfully."});
  }
  return res.status(400).json({message: "Review failed."});
});


// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn]
  if(!book)
    return res.status(404).json({ message: "Book not found." });
  if(book.reviews[req.user.username]) {
    delete book.reviews[req.user.username]
    return res.status(200).json({message: "Review deleted successfully."});
  }
  return res.status(400).json({message: "Delete review failed."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
