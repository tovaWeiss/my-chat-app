import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { serverUri } from "../../config";
import { checkAuth } from "../../utils/functions";
import './style.css';

const Chat = ({ socket }) => {
    const { id } = useParams();
    let [searchParams, setSearchParams] = useSearchParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const name = searchParams.get('name');

    let userId = '';
    const token = localStorage.getItem("chat-app-token");
    if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.user_id;
    }


    const sendMessage = () => {
        if (socket) {
            socket.emit("chatMessage", {
                chatId: id,
                message: newMessage,
            });
            setNewMessage("");
        }
    };

    const getMessages = () => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.getItem("chat-app-token"),
            },
            body: JSON.stringify({
                chatId: id,
            })
        };

        const res = fetch(`${serverUri}/chat/get-messages-by-chat`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.length) {
                    setMessages(data)
                }
            })
    }

    useEffect(() => {
        if (socket) {
            socket.on("newMessage", (message) => {
                const newMessages = [...messages, message.message];
                setMessages(newMessages);
            });
        }
    });

    useEffect(() => {
        checkAuth();
        if (socket) {
            socket.emit("joinChat", {
                chatId: id,
            });
        }
        getMessages();

        return () => {
            //Component Unmount
            if (socket) {
                socket.emit("leaveChat", {
                    chatId: id,
                });
            }
        };
    }, []);

    return (
        <div className="card-chat">
            <div className="chat-app">
                <div className="chat-header">
                    <h3>{ name }</h3>
                </div>
                <div className="chat-content">
                    <div className="chat-content-in">
                        { messages.map((message, i) => (
                            <div key={ i } className="message">
                                {
                                    userId == message.user._id ?
                                        <div className="message-me">
                                            <div className="alert alert-info col-md-5 ">
                                                <b>me: </b>
                                                <p>  { message.message }</p>
                                            </div>
                                        </div>
                                        :
                                        <div className="message-else">
                                            <div className="alert alert-secondary float-right col-md-5" >
                                                <b>  { message.user.fullName }:</b>
                                                <p> { message.message }</p>
                                            </div>
                                        </div>
                                }
                            </div>
                        )) }
                    </div>
                </div>
                <div className="input-group">
                    <div className="input-group-prepend send-message m-1">
                        <input
                            className="form-control"
                            value={ newMessage }
                            type="text"
                            name="message"
                            placeholder="Insert message :)"
                            onChange={ (e) => setNewMessage(e.target.value) }
                        />
                    </div>
                    <div className="input-group-prepend send-message-btn m-1">
                        <button
                            className="btn send-message-btn-in btn-primary"
                            onClick={ sendMessage }
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;