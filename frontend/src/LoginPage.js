//import './LoginPage.css'
import './RegisterPage'
import {Link, Route} from 'react-router-dom'
import { useState } from "react";
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function LoginPage() {
    let navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: "",
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check empty fields
        if (userData.username == "" || userData.password == "") {
            setErrorMessage('Please enter all fields.');
            return;
        }
        
        // Check username is valid
        try {
            const response = await axios.get(`http://localhost:3000/auth/checkUsername?username=${userData.username}`);
            if (!response.data.exists) {
              setErrorMessage('The username you entered is invalid. Please check your username and try again.');
              return;
            }
        } catch (error) {
            console.log(error);
            return;
        }


        setErrorMessage(null);

        try {
            const response = await axios.post("http://localhost:3000/auth/login", userData);
            if (response.status == 200) {
                console.log("200");
                navigate("/Feedy", { state: {username: userData.username }});
            }
        } catch (error) {
            setErrorMessage('The password is incorrect.');
            console.log(error);
            return;
        }
    };
    
    const handleInputChange = async (event) => {
        const { name, value } = event.target;
        setUserData(prevState => ({
          ...prevState,
          [name]: value
        }));
    };
    return (          
        <form onSubmit={handleSubmit}>
            <body className="App-header">
                <div className="row justify-content-md-center">
                    <div className="regis">
                        <div className="loggg">
                            Login
                        </div>
                        <div>
                            Username:<input type="username" name="username" placeholder="Enter Username" onChange={handleInputChange}></input>
                        </div>
                        <div>
                            Password:<input type="password" name="password" placeholder="Enter Password" onChange={handleInputChange}></input>
                        </div>
                        <div className="regi">
                            <p> Not registered? <Link to='/RegisterPage' className="h">Click here</Link> to register</p>
                        </div>
                        <div>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <button type="submit" className="btn btn-lg btn-primary">
                                Login
                            </button>
                        </div>
                    </div>

                </div>
            </body>
        </form>
    );
}

export default LoginPage;    