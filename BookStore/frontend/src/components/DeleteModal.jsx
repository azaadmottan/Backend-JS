import axios from 'axios';
import React from 'react';
import { IoClose } from "react-icons/io5";


function DeleteModal({ id, onClose, fetchBooks }) {

    const handelDeleteBook = (id) => {

        axios  
            .delete(`http://localhost:5555/book/deleteBook/${id}`)
            .then((res) => {

                onClose(true);
                fetchBooks();
            })
            .catch((error) => {

                console.log(error);
            });
    }

    return (

    <>
    <div 
        className='fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center transition-all delay-150'
        onClick={onClose}
        >

        <div 
            className='bg-white w-4/12 h-60 p-6 rounded-xl relative'
            onClick={(e) => (e.stopPropagation())}

        >
            <span 
                className='text-3xl absolute right-2 top-2 p-2 hover:bg-zinc-200 rounded-full cursor-pointer'
                onClick={onClose}
            >
                <IoClose />
            </span>

            <div>

                <h2 className='text-2xl font-semibold my-4'>Delete Book</h2>

                <p className='text-xl my-6'>Are you sure you want to delete this book ?</p>

                <button 
                    className='p-2 xl:mt-5 font-semibold bg-[#413ce5] text-white rounded-lg hover:bg-[#242ffe]'
                    onClick={() => handelDeleteBook(id)}
                >Yes, I'm Sure!</button>
            </div>
        </div>

    </div>
    </>

    );
}

export default DeleteModal;