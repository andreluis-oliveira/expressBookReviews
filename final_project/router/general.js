const express = require('express')
let books = require('./booksdb.js')
let doesExist = require('./auth_users.js').doesExist
let users = require('./auth_users.js').users

const public_users = express.Router()

public_users.post('/register', (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password })
      return res
        .status(200)
        .json({ message: 'User successfully registred. Now you can login' })
    } else {
      return res.status(404).json({ message: 'User already exists!' })
    }
  }

  return res.status(404).json({ message: 'Unable to register user.' })
})

// Get the book list available in the shop
const getAllAvaliableBooks = () => {
  return books
}

public_users.get('/', async (req, res) => {
  const avaliableBooks = await getAllAvaliableBooks()

  return res.status(200).json(avaliableBooks)
})

// Get book details based on ISBN
const getBookByIsbn = (isbn) => {
  return Object.values(books).find((book) => book.isbn === isbn)
}

public_users.get('/isbn/:isbn', async (req, res) => {
  const book = await getBookByIsbn(req.params.isbn)

  if (!book) {
    const message = `No results for isbn "${req.params.isbn}" in Books.`
    res.status(404).json({ success: false, error: message })
  } else {
    res.json({ success: true, data: book })
  }
})

// Get all books based on author
const getBooksByAuthor = (author) => {
  return Object.values(books).filter((book) => book.author === author)
}

public_users.get('/author/:author', async (req, res) => {
  const list = await getBooksByAuthor(req.params.author)

  if (!list) {
    const message = `No results for author "${req.params.author}" in Books.`
    res.status(404).json({ success: false, error: message })
  } else {
    res.json({ success: true, data: list })
  }
})

// Get book details based on title
const getBookByTitle = (title) => {
  return Object.values(books).find((book) => book.title === title)
}

public_users.get('/title/:title', async (req, res) => {
  const book = await getBookByTitle(req.params.title)

  if (!book) {
    const message = `No results for "${req.params.title}" in Books.`
    res.status(404).json({ success: false, error: message })
  } else {
    res.json({ success: true, data: book })
  }
})

//  Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const book = Object.values(books).find(
    (book) => book.isbn === req.params.isbn
  )

  if (!book) {
    const message = `No results for isbn "${req.params.isbn}" in Books.`
    res.status(404).json({ success: false, error: message })
  } else {
    res.json({ success: true, data: book.reviews })
  }
})

module.exports.general = public_users
