import './RegisterPage.css'
import logo from "./logo.jpg"
import * as React from 'react';
import { useState } from "react";
import {Link, Route} from 'react-router-dom'
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    return(
        <body className="App-header">
            <div className="head-line">
                <img src={logo} alt="Logo" type="logo" />
            </div>
            <div className="row justify-content-md-center">
                <div className="regis">
                    <div className="loggg">
                        Register
                    </div>
                    <div>
                        Username:<input type="username" id="username" placeholder="Enter Username"></input>
                    </div>
                    <div>
                        Password:<input type="password" id="password" placeholder="Enter Password"></input>
                    </div>
                    <div>
                        Confirm Password:<input type="password" id="conf-password" placeholder="Enter Password"></input>
                    </div>
                    <div>
                        Display Name:<input type="name" id="displayname" placeholder="Enter Name"></input>
                    </div>

                    <div className='regi'>
                    <p> Already registered? <Link to='/' className="h">Click here</Link> to login</p>
                    </div>
                
                    <div>
                        <button types="button" className="btn btn-lg btn-primary">
                            Register
                        </button>
                    </div>
                </div>

            </div>
        </body>
    );
}

export default RegisterPage;