import React from "react";
import "./style.css";


const Logout = () => {
    const token = localStorage.removeItem("chat-app-token");
    window.location.href = '/login';
    return (
        <div>
        </div>
    );

};


export default Logout;
