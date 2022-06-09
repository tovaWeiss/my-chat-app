import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { serverUri } from "../../config";
import { checkAuth } from "../../utils/functions";
import './style.css';

const Dashboard = () => {
    const [chats, setChats] = React.useState([]);
    const [chatName, setChatName] = useState("");
    const [message, setMessage] = useState("");

    const getChats = () => {

        const requestOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem("chat-app-token"),
            }
        };

        const res = fetch(`${serverUri}/chat`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.length) {
                    setChats(data);
                }
            });
    };

    const createChat = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem("chat-app-token"),
            },
            body: JSON.stringify({
                name: chatName,
            })
        };

        const res = fetch(`${serverUri}/chat/create-chat`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (!data.data._id) {
                    setMessage(data.data.message);
                }
                else {
                    const newchats = [...chats, data.data];
                    setChats(newchats);
                }
            })
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        createChat();
    }

    useEffect(() => {
        checkAuth();
        getChats();
    }, []);

    return (
        <div className="card-chat">
            <div className="chat-app">

                <div className="chat-header">
                    <h3>Chats</h3>
                </div>
                {
                    message &&
                    <div className="alert alert-danger">
                        { message }
                    </div>
                }
                <form
                    className="input-group"
                    onSubmit={ handleSubmit }
                >
                    <div className="input-group-prepend add-chat-name m-1">
                        <div className="inputGroup">
                            <input
                                required={ true }
                                onChange={ (e) => setChatName(e.target.value) }
                                type="text"
                                name="chatName"
                                className="form-control"
                                placeholder="Chat Name"
                            />

                        </div>
                    </div>
                    <div className="input-group-prepend add-chat-btn m-1">
                        <button
                            className="btn add-chat-btn-in btn-primary"
                        >
                            Create Chat
                        </button>
                    </div>
                </form>
                <div className="chats">
                    { chats.map((chat) => (
                        <div key={ chat._id } className="card chat-name">
                            <div className="card-body">
                                <div className="py-3 chat-name-item">
                                    <Link className="chat-name-item-link" to={ `/chat/${chat._id}?name=${chat.name}` }>
                                        <div className="">
                                            <h4>{ chat.name }</h4>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )) }
                </div>
            </div>
        </div>
    );
};

export default Dashboard;