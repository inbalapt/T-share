import './LoginPage.css'
import './RegisterPage'
import logo from "./logo.jpg"
import {Link, Route} from 'react-router-dom'
import ReactDOM from 'react-dom'
import { useNavigate } from "react-router-dom";


function LoginPage() {
    return (          
        
        <body className="App-header">
            <div className="head-line">
                <img src={logo} alt="Logo" type="logoBig" />
            </div>
            <div className="row justify-content-md-center">
                <div className="fooo">
                    <div className="loggg">
                        Login
                    </div>
                    <div>
                        Username:<input type="username" id="username" placeholder="Enter Username"></input>
                    </div>
                    <div>
                        Password:<input type="password" id="password" placeholder="Enter Password"></input>
                    </div>
                    <div className="registering">
                        <p> Not registered? <Link to='/RegisterPage' className="h">Click here</Link> to register</p>
                    </div>
                    <div>
                        <button types="button" className="btn btn-lg btn-primary">
                            Login
                        </button>
                    </div>
                </div>

            </div>
        </body>
    );
}

export default LoginPage;    