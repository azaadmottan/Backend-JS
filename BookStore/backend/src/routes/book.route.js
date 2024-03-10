import express from "express";
import { Book } from "../models/book.model.js";

const bookRouter = express.Router();


// Route  for store books in the database

bookRouter.post('/', async (req, res) => {

    try {
        
        if (!(req.body.title) || !(req.body.author) || !(req.body.publishYear) || !(req.body.price)) {
            
            return res
                .status(400)
                .send({
                    message: "Send all required fields data: 'title', 'author', 'publishYear' and 'price'.",
                })
        }

        const newBook = {

            title: req.body.title,
            author: req.body.author,
            publishYear: req.body.publishYear,
            price: req.body.price
        }

        const book = await Book.create(newBook);

        return res.status(201).send(book);

    } catch (error) {
        
        return res
            .status(500)
            .send({ message: error.message });
    }
});

// Route for getting all books from the database

bookRouter.get('/getBooks', async (req, res) => {

    try {

        const books = await Book.find({});

        return res
            .status(200)
            .json({
                length: books.length,
                data: books
            });

    } catch (error) {
        
        return res
            .status(500)
            .send({ message: error.message });
    }
});

// Route for getting one book from the database by its ID

bookRouter.get('/getBook/:id', async (req, res) => {

    try {

        const { id } = req.params;

        const book = await Book.findById(id);

        return res
            .status(200)
            .json({
                length: book.length,
                data: book
            });

    } catch (error) {
        
        return res
            .status(500)
            .send({ message: "Book not found." });
    }
}); 

// Route for update book by its ID

bookRouter.put('/updateBook/:id', async (req, res) => {

    try {
        
        
        if (!(req.body.title) || !(req.body.author) || !(req.body.publishYear) || !(req.body.price)) {
            
            return res
                .status(400)
                .send({ message: "Send all required fields data 'title', 'author', 'publishYear', 'price'." });
        }
            
        const { id } = req.params;

        const result = await Book.findByIdAndUpdate(id, req.body);

        if (!result) {

            return res
                .status(404)
                .send({ message: "Book not found." });
        }

        return res
            .status(200)
            .send({ message: "Book updated successfully."});

    } catch (error) {
        
        return res
            .status(400)
            .send({ message: error.message });
    }
});

// Route for delete book by its ID

bookRouter.delete('/deleteBook/:id', async (req, res) => {

    try {
        
        const { id } = req.params;

        const result = await Book.findByIdAndDelete(id);

        if(!result) {

            return res
                .status(404)
                .send({ message: "Book not found."});
        }

        return res
            .status(200)
            .send({ message: "Book deleted successfully."});
            
    } catch (error) {
        
        return res
            .status(400)
            .send({ message: error.message });
    }
});

export default bookRouter;
