import React from "react";
import Header from "./components/Header";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";

function App() {
  return (
  <>
    <Header />
    
      <Outlet>

        <div className="text-3xl">Welcome to Book Store</div>

      </Outlet>

    <Footer />
  </>
  );
}

export default App;