const express = require('express');
//importing the dependencies
var bodyParser = require("body-parser");//required for a HTTP request - available in node modules

//database
const database = require("./database");

//initialize the express
const booky = express();//Booky is an instance of express js

booky.use(bodyParser.urlencoded({extended : true}));//the url can be of any character
booky.use(bodyParser.json());
/*
route       /
Description      get all the books
access           public access
parameter        none
methods          get
*/

booky.get("/",(req,res) => {
    return res.json({books: database.books});
});

/*
route           /is
Description      get a specific book
access           public access
parameter        isbn
methods          get
*/
//params = iterates through the parameters

booky.get("/is/:isbn", (req, res) =>{
    const getSpecificBook = database.books.filter(
        (book) => book.ISBN === req.params.isbn
    );
    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the ISBN of ${req.params.isbn}`})
    }
    return res.json({book: getSpecificBook})
});
/*
route            /c 
Description      get a specific based on category
access           public access
parameter        category
methods          get
*/



booky.get("/c/:category", (req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.category.includes(req.params.category)
    );
    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the category of ${req.params.category}`})
    }
    return res.json({book: getSpecificBook});
});
/*
route            /l 
Description      get a specific based on language
access           public access
parameter        language
methods          get
*/
booky.get("/l/:language",(req,res) => {
    const getSpecificBook = database.books.filter(
        (book) => book.language === req.params.language
    )
    if(getSpecificBook.length === 0){
        return res.json({error: `No book found for the language of ${req.params.language}`})
    }
    return res.json({book: getSpecificBook})
});
/*
route            /author
Description      get all authors
access           public access
parameter        None
methods          get
*/
booky.get("/author",(req,res)=>{
    return res.json({authors: database.author})
});
/*
route            /id/:id
Description      get a specific author
access           public access
parameter        id
methods          get
*/
booky.get("/author/id/:ID", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.ID === req.params.ID
    )
    if(getSpecificAuthor.length === 0){
        return res.json({error: `No author found with the id of ${req.params.ID}`})
    }
    return res.json({author: getSpecificAuthor})
});
/*
route            /author/book
Description      get a list of authors based on books
access           public access
parameter        isbn
methods          get
*/
booky.get("/author/book/:isbn", (req,res) => {
    const getSpecificAuthor = database.author.filter(
        (author) => author.books.includes(req.params.isbn)
    );
    if(getSpecificAuthor.length === 0){
        return res.json({error: `NO author found for the book of ${req.params.isbn}`})
    }
    return res.json({authors: getSpecificAuthor});
})
/*
route            /publication
Description      get all the publications
access           public access
parameter        None
methods          get
*/
booky.get("/publications", (req,res) => {
    return res.json({publications: database.publication})
})
/*
route            /publication
Description      get specific publication
access           public access
parameter        id
methods          get
*/
booky.get("/publication/id/:id", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.id === req.params.id
    )
    if(getSpecificPublication.length === 0){
        return res.json({error: `No publication found with the id of ${req.params.id}`})
    }
    return res.json({publication: getSpecificPublication})
});
/*
route            /author/book
Description      get a list of publications based on books
access           public access
parameter        isbn
methods          get
*/
booky.get("/publication/book/:isbn", (req,res) => {
    const getSpecificPublication = database.publication.filter(
        (publication) => publication.books.includes(req.params.isbn)
    );
    if(getSpecificPublication.length === 0){
        return res.json({error: `NO author found for the book of ${req.params.isbn}`})
    }
    return res.json({publication: getSpecificPublication});
});

//POST

/*
route            /book/new
Description      add new book
access           public access
parameter        None
methods          POST
*/

booky.post("/book/new",(req,res)  => {
    const newBook = req.body;//body of our request
    database.books.push(newBook);
    return res.json({updateBooks : database.books});
});

/*
route            /author/new
Description      add new author
access           public access
parameter        None
methods          POST
*/

booky.post("/author/new",(req,res)  => {
    const newAuthor = req.body;//body of our request
    database.author.push(newAuthor);
    return res.json(database.author);
});

/*
route            /publication/new
Description      add new publication
access           public access
parameter        None
methods          POST
*/

booky.post("/publication/new",(req,res)  => {
    const newPublication = req.body;//body of our request
    database.publication.push(newPublication);
    return res.json(database.publication);
});

/*
route            /publication/update/book
Description      update or add new publication
access           public access
parameter        isbn
methods          PUT
*/

booky.put("/publication/update/book/:isbn", (req,res) => {
    //update the publication database
    database.publication.forEach((pub) => {
        if(pub.id === req.body.pubId){
            return pub.books.push(req.params.isbn);
        }
    });
    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn){
            book.publications = req.body.pubId;
            return;
        }
    });
    return res.json(
        {
            books: database.books,
            publications: database.publication,
            message: "Successfully updated publicaitons"
        }
    )
});

/*
route            /book/delete
Description      delete a book
access           public access
parameter        isbn
methods          DELETE
*/

booky.delete("/book/delete/:isbn", (req,res) => {
    //whichever book that does not match with the isbn,
    //just send it to an updated book database array
    // and rest will be filtered out
    const updatedBookDatabase = database.books.filter(
        (book) => book.ISBN !== req.params.isbn
    )
    database.books = updatedBookDatabase;
    
    return res.json({books: database.books});
});

/*
route            /book/delete/author
Description      delete an author from a book and vice versa
access           public access
parameter        isbn, authorId
methods          DELETE
*/

booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
    //update the book database
    database.books.forEach((book) => {
        if(book.ISBN === req.params.isbn) {
            const newAuthorList = book.author.filter(
                (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
            );
            book.author = newAuthorList;
            return;
        }
    });
    //update the author database
     database.author.forEach((eachAuthor) => {
        if(eachAuthor.id === parseInt(req.params.authorId)){
            const newBookList = eachAuthor.books.filter(
                (book) => book !== req.params.isbn
            );
            eachAuthor.books = newBookList;
            return;
        }
     })
     return res.json({
        book: database.books,
        author: database.author,
        message: "Author was deleted"
     })
});

booky.listen(3000, () => {
    console.log("Server is up and running");
});
