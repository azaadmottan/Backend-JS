import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsInfoCircle } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteModal from './DeleteModal';

function BookCard({ book, fetchBooks }) {

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    return (

    <>
    <div className='bg-zinc-200 w-[250px] rounded-xl p-4 shadow-md'>
        
        <h2 className='text-2xl mb-3 font-semibold italic'>{book.title}</h2>

        <h3 className='text-xl mb-2 font-medium'>{book.author}</h3>


        <div className='flex items-center justify-between my-6'>
            <h4 className='text-lg text-white bg-blue-500 rounded-lg px-3 py-1'>{book.publishYear}</h4>

            <h4 className='text-lg font-medium text-white bg-red-600 px-3 py-1 rounded-lg'>₹ {book.price}</h4>

        </div>

        <p className='flex items-center justify-around mt-4'> 
            <button
                title='View Book' className='hover:bg-white rounded-full p-2'
                onClick={() => navigate(`/viewBook/${book._id}`)}

            >
                <BsInfoCircle className='text-xl' />
            </button>

            <button
                title='Edit Book Info' 
                className='hover:bg-white rounded-full p-2'
                onClick={() => navigate(`/editBook/${book._id}`)}
            >
                <FaRegEdit className='text-xl' />
            </button>

            <button 
                title='Delete Book' 
                className='hover:bg-white rounded-full p-2'
                onClick={() => setShowModal(true)}
            >
                <AiOutlineDelete className='text-xl' />
            </button>
        </p>

        {
            showModal && (

                <DeleteModal id={book._id} onClose={() => setShowModal(false)} fetchBooks={() => fetchBooks()} />
            )
        }
    </div>

    
    </>

    )
}

export default BookCard;