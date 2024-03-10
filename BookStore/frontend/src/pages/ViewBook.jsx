import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';


function ViewBook() {

    const [isLoading, setIsLoading] = useState(false);
    const [bookData, setBookData] = useState([]);
    const { id } = useParams();

    useEffect(() => {
    

        setIsLoading(true);

        axios
            .get(`http://localhost:5555/book/getBook/${id}`)
            .then((response) => {

                setIsLoading(false);
                setBookData(response.data.data);
            })
            .catch((error) => {

                console.log(error);
            })
    }, [])
    
    return (

    <>
    <div className='min-h-[80vh] w-8/12 mx-auto'>
        
        <h2 className='text-3xl text-center my-6'>Book Profile</h2>

        {
            (isLoading) ? (

                <Spinner />
            ) : (

                <div className='border-2 rounded-xl px-8 py-4 text-xl'>
                    <p className='mb-3'>Book Id: <span className='font-semibold'>{bookData._id}</span></p>
                    <p className='mb-3'>Title: <span className='font-semibold'>{bookData.title}</span></p>
                    <p className='mb-3'>Author: <span className='font-semibold'>{bookData.author}</span></p>
                    <p className='mb-3'>Publish Year: <span className='font-semibold'>{bookData.publishYear}</span></p>
                    <p className='mb-3'>Price: ₹ <span className='font-semibold'>{bookData.price}</span></p>
                    <p className='mb-3'>Created At: <span className='font-semibold'>{new Date(bookData.createdAt).toString()}</span></p>
                    <p>Last Updated At: <span className='font-semibold'>{new Date(bookData.updatedAt).toString()}</span></p>
                </div>
            )
        }

    </div>
    </>

    );
}

export default ViewBook;