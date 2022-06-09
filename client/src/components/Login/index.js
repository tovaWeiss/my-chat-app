import React, { useState } from 'react';
import { serverUri } from '../../config';

export default function Login(props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const verifyUser = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password,
                email
            })
        };

        const res = fetch(`${serverUri}/user/get-user`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data?.token) {
                    localStorage.setItem("chat-app-token", data.token);
                    props.setupSocket();
                    window.location.href = '/dashboard';
                }
                else {
                    setError(data);
                }
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        verifyUser();
    }

    const enableSubmit = () => {
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if ((!email || regex.test(email) === false) || !password) {
            return false;
        }
        return true;
    }

    return (
        <form
            onSubmit={ handleSubmit }
        >
            <h3>Sign In</h3>
            <div className="mb-3">
                <label>Email address</label>
                <input
                    onChange={ (e) => setEmail(e.target.value) }
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
                />
            </div>
            <div className="mb-3">
                <label>Password</label>
                <input
                    onChange={ (e) => setPassword(e.target.value) }
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                />
            </div>
            <div className="d-grid">
                <button
                    disabled={ !enableSubmit() }
                    type="submit"
                    className="btn btn-primary"
                >
                    Submit
                </button>
            </div>
            {
                error && <div className='alert alert-danger'>
                    { error }
                </div>
            }
        </form >
    )
}