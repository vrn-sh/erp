import React, { useState } from 'react';
import { Icon } from 'react-icons-kit';
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import "./Login.scss"

const REGEX = RegExp(/^\s?[A-Z0–9]+[A-Z0–9._+-]{0,}@[A-Z0–9._+-]+\.[A-Z0–9]{2,4}\s?$/i);

export default function Login() {
    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [errorPwd, setErrorPwd] = useState('')
    
    const checkEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);

        if (REGEX.test(email) === false) {
            setErrorEmail("Please enter valid email address.")
        } else {
            setErrorEmail("")
        }
    }

    const checkPwd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPwd(e.target.value);

        if (pwd.length < 7) {
            setErrorPwd("Password should have at least 8 characters.")
        } else {
            setErrorPwd("")
        }
    }

    const submit = () => {
        if (email != "" && pwd.length > 7) {
            console.log("Log in successfully!")
        } else {
           console.log("Something is wrong")
        }
    }

    return (
        <>
            <section className="login-container">

                <div className="login-text" id="login-text">
                    <p>
                        <h2>voron</h2>
                        <h1>Lorem ipsum dolor sit amet consectet. Neque.</h1>
                        <span className="no-bold">Lorem ipsum dolor sit amet consectetur. Quis platea lectus.</span>
                    </p>
                </div>

                <div className="login-form" id="login-form">
                    <div className='wrapper'>
                        <div className='form-wrapper'>
                            <h2>Welcome back!</h2>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="text" className="form-control" onChange={checkEmail}/>
                                <p className='error'>{errorEmail}</p>

                                <label>Password</label>
                                <div className='input-pwd'>
                                    <input type="password" className="form-control" onChange={checkPwd}/>
                                    <span style={{ color: "#8A8A8A"}}><Icon icon={eyeOff} /></span>
                                </div>
                                <p className='error'>{errorPwd}</p>

                                <div className='submit'>
                                    <button onClick={submit}>LOG IN</button>
                                </div>
                            </div>

                        </div>
                     </div>
                </div>
            </section>
        </>
    )
}