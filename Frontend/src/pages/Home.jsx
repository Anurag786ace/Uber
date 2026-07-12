import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1527603815363-e79385e0747e?q=80&w=676&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen w-full pt-5 flex justify-between flex-col bg-red-400">
            <img className="w-16 ml-8" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />
            <div className="text-center bg-white py-5 px-5 rounded-t-3xl">
                <h2 className="text-3xl font-bold">Get Started with Uber</h2>
                <Link to="/user-login" className=" flex items-center justify-center w-full bg-black text-white px-6 py-2 rounded-full mt-5">CONTINUE</ Link>


            </div>
        </div>
    )
}

export default Home;