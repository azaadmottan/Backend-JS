import React, { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';


function Home() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [books, setBooks] = useState([]);


    const fetchBooks = () => {

        setIsLoading(true);

        axios
        .get('http://localhost:5555/book/getBooks')
        .then((response) => {

            setBooks(response.data.data);

            setIsLoading(false);
        })
        .catch((error) => {

            setIsLoading(false);
            console.log(error);
        })
    }

    useEffect(() => {
        
        fetchBooks();

    }, []);

    return (

    <>
    <div className='min-h-[85.5vh] w-10/12 mx-auto px-5'>

        <div>
            <h2 className='text-4xl font-semibold text-center my-6'>Popular Books</h2>
        </div>

        {
            (isLoading) ? (

                <Spinner />

            ) : (
                
                <div className='mx-auto grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'> 
                    
                    {
                        books.map((book) => (

                            <BookCard book={book} key={book._id} fetchBooks={() => fetchBooks()} />
                        ))
                    }
                </div>
            )
        }

    </div>
    </>

    );
}

export default Home;