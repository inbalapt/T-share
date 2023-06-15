import './LoginPage.css'
import './RegisterPage'
import {Link, Route} from 'react-router-dom'
import { useState } from "react";
import ReactDOM from 'react-dom';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import logo from './../logo.jpeg'

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
                navigate("./HomePage", { state: {username: userData.username }});
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
        <div className='login-page'>
            <div className='left-section'> 
                
                <img src={logo} alt='Logo' />  
                <h1 className='head-login1'>Step into Sustainable Style </h1>
                <h1 className='head-login2'>Welcome to T-Share </h1>
                 
            </div> 


            <div className='right-section' style={{ backgroundImage:`url(${`/pictures/userfeed.png`})`}}>
                <form onSubmit={handleSubmit} className='login-form'>           
                    <body className="App-header">                   
                        <div className="login-form-head">
                            Login
                        </div>

                        <label className='login-item-label'>
                            <div>Username:</div>
                            <input type="username" name="username" placeholder="Enter Username" onChange={handleInputChange}></input>
                        </label>

                        <label className='login-item-label'>
                            <div> Password:</div>
                            <input type="password" name="password" placeholder="Enter Password" onChange={handleInputChange}></input>
                        </label>


                        <div className="did-regis">
                            <p> Not registered? <Link to='/RegisterPage' className="h">Click here</Link> to register</p>
                        </div>

                        <div className='login-btn'>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <button  className="btn btn-lg btn-primary submit-button">
                                Login
                            </button> 
                        </div>
                    </body>
                </form> 
            </div>
        </div>
    );
}

export default LoginPage;    