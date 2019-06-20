/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const Book = require("../models/book");
const mongoose = require("mongoose");
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
mongoose.connect(process.env.DB, { useNewUrlParser: true })

module.exports = function (app) {

  app.route('/api/books')
    .get((req, res) => {
      Book.find({}).select("_id title comments").then(books => {
        if(!books) {
          return res.json({books: "No books found"})
        }
        const result = books.map(book => {
          return {_id: book._id, title: book.title, commentcount: book.comments.length}
        })
        return res.json(result);
      }).catch(err => console.log(err))
    })
    
    .post((req, res) => {
      const title = req.body.title;
      const book = new Book({title});
      book.save().then(result => {
        const {_id, title, comments} = result;
        res.json({_id, title, comments})
      }).catch(err => console.log(err))
    })
    
    .delete((req, res) => {
      Book.deleteMany({}).then(result => {
        res.send("complete delete successful");
      }).catch(err => console.log(err))
    });



  app.route('/api/books/:id')
    .get((req, res) =>{
      const bookid = req.params.id;
      Book.findOne({_id: bookid}).then(book => {
        if(!book) {
          res.send("no book by that id exists");
        }
        res.json({_id: book._id, title: book.title, comments: book.comments})
      }).catch(err => console.log(err))
    })
    
    .post((req, res) =>{
      const bookid = req.params.id;
      const comment = req.body.comment;
      Book.findOne({_id: bookid}).then(book => {
        if(!book) {
          res.send("no book by that id exists");
        }
        const comments = book.comments;
        comments.push(comment);
        console.log(comments, book, comment)
        const updatedComments = comment ? comments : book.comments;
        book.comments = updatedComments;
        book.save().then(result => {
          res.json({_id: result._id, title: result.title, comments: result.comments})
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    })
    
    .delete((req, res) =>{
      var bookid = req.params.id;
      Book.findOneAndRemove({_id: bookid}).then(result => {
        res.send("delete successful");
      }).catch(err => console.log(err))
    });
  
};
