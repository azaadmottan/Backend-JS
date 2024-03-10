import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CreateBook from "./pages/CreateBook.jsx";
import ShowBooks from "./pages/ShowBooks.jsx";
import EditBook from "./pages/EditBook.jsx";
import ViewBook from './pages/ViewBook.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/createBook",
        element: <CreateBook />
      },
      {
        path: "/viewBook/:id",
        element: <ViewBook />
      },
      {
        path: "/showBooks",
        element: <ShowBooks />
      },
      {
        path: "/editBook/:id",
        element: <EditBook />
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(

  <React.StrictMode>

    <RouterProvider router={router} />

  </React.StrictMode>,

);
