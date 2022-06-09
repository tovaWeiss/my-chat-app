import React, { useState } from 'react';
import { serverUri } from '../../config';

export default function SignUp(props) {
    const [fullName, setfullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const enableSubmit = () => {
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if ((!email ||
            regex.test(email) === false) ||
            !password ||
            !CheckPassword(password) ||
            !fullName) {
            return false;
        }
        return true;
    }

    function CheckPassword(password) {
        var paswd = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
        if (password.match(paswd)) {
            return true;
        }
        return false;
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        createUser()
    }

    const createUser = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName,
                password,
                email
            })
        };

        const res = fetch(`${serverUri}/user/create-user`, requestOptions)
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

    return (
        <form
            onSubmit={ handleSubmit }
        >
            <h3>Sign Up</h3>
            <div className="mb-3">
                <label>Full name</label>
                <input
                    onChange={ (e) => setfullName(e.target.value) }
                    type="text"
                    className="form-control"
                    placeholder="First name"
                />
            </div>
            <div className="mb-3">
                <label>
                    Email address
                </label>
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
                    Sign Up
                </button>
            </div>
            <p className="forgot-password text-right">
                Already registered <a href="/sign-in">sign in?</a>
            </p>

            {
                error && <div className='alert alert-danger'>
                    { error }
                </div>
            }
        </form>
    )
}