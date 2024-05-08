const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()

let users = []

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  })
  if (userswithsamename.length > 0) {
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password
  })
  if (validusers.length > 0) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({ message: 'Error logging in' })
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      'access',
      { expiresIn: 60 * 60 }
    )

    req.session.authorization = {
      accessToken,
      username,
    }
    return res.status(200).send('User successfully logged in')
  } else {
    return res
      .status(208)
      .json({ message: 'Invalid Login. Check username and password' })
  }
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username
  const review = req.body.review

  for (const [key, book] of Object.entries(books)) {
    if (book.isbn === isbn) {
      book.reviews[username] = review
    }
  }

  return res.status(200).send('Thanks for your review!')
})

// Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn
  const username = req.session.authorization.username

  for (const [key, book] of Object.entries(books)) {
    if (book.isbn === isbn) {
      delete book.reviews[username]
    }
  }

  return res.status(200).send('Success!')
})

module.exports.authenticated = regd_users
module.exports.doesExist = doesExist
module.exports.users = users
