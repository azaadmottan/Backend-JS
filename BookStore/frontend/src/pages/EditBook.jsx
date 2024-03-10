import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from "../components/Spinner.jsx";

function EditBook() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publishYear, setPublishYear] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {

        setIsLoading(true);

        axios
            .get(`http://localhost:5555/book/getBook/${id}`)
            .then((response) => {

                setTitle(response.data.data.title);
                setAuthor(response.data.data.author);
                setPublishYear(response.data.data.publishYear);
                setPrice(response.data.data.price);

                setIsLoading(false);

            })
            .catch((error) => {

                console.log(error);
            })
    }, []);

    const updateBook = () => {

        const data = {
            title,
            author,
            publishYear,
            price
        }

        axios
            .put(`http://localhost:5555/book/updateBook/${id}`, data)
            .then((response) => {

                navigate("/")
            })
            .catch((error) => {

                console.log(error);
            })

    }
    
    return (

    <>
    <div className='min-h-[80vh] w-8/12 mx-auto'>
        <h1 className='text-3xl text-center my-6'>Edit Book</h1>

        {
            (isLoading) ? (

                <Spinner />
            ) : (

                <div className='w-8/12 border-2 mx-auto p-5 rounded-xl'>
                <p className='text-xl my-1'>Title</p>
                <input 
                    type="text" 
                    className='p-1 px-2 text-lg border-2 outline-none focus:border-sky-500 rounded-lg w-full'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <p className='text-xl my-1'>Author</p>
                <input 
                    type="text" 
                    className='p-1 px-2 text-lg border-2 outline-none focus:border-sky-500 rounded-lg w-full ' 
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                />

                <p className='text-xl my-1'>Publish Year</p>
                <input
                    type="text" 
                    className='p-1 px-2 text-lg border-2 outline-none focus:border-sky-500 rounded-lg w-full ' 
                    value={publishYear}
                    onChange={(e) => setPublishYear(e.target.value)}
                />

                <p className='text-xl my-1'>Price</p>
                <input
                    type="text" 
                    className='p-1 px-2 text-lg border-2 outline-none focus:border-sky-500 rounded-lg w-full ' 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <button 
                    className='p-2 bg-[#443ef1] text-white font-semibold rounded-lg mt-4 hover:bg-[#3721ff]'
                    onClick={()=> updateBook()}
                >Save & Update</button>
            </div>
            )
        }
        
    </div>
    </>

    );
}

export default EditBook;