import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {

    const navigate = useNavigate();

    const navItems = [
        {
            name: "Home",
            slug: "/"
        },
        {
            name: "Add Book",
            slug: "/createBook"
        },
        
    ];

    return (

    <>
    <div className='sticky top-0'>

        <div className='w-full p-2 bg-gradient-to-r from-[#220ff4] to-[#fd1313] text-white font-bold'> 
            <h2 className='text-center text-3xl'>Welcome to Digital Book Store</h2>
        </div>

        <div className='w-full bg-[#09083b] text-white font-semibold p-2'>
            <ul className='flex items-center justify-around'>
            {
                navItems.map((item) => (
                    <button onClick={() => navigate(item.slug)} key={item.name} className='p-2 hover:bg-[#0202a1] rounded-xl'>{item.name}</button>
                ))
            }
            </ul>
        </div>

    </div>
    </>

    );
}

export default Header;