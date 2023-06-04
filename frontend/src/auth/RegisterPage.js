import './RegisterPage.css'
import * as React from 'react';
import { useState } from "react";
import {Link, Route} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from './../logo.jpeg'


function RegisterPage() {
  let navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    fullName: "",
    weight: "",
    height: "",
    city: ""
  });
  const [errorMessage, setErrorMessage] = useState(null);
  
  const handleSubmit = async (event) => {

    event.preventDefault();
  

    /* Validation Check */
    const confPass = document.getElementsByName('confPassword')[0].value;
  
    // Check necessary fields 
    if (userData.email == "" || userData.username == "" || userData.password == "" || userData.fullName == "" || confPass == "" || userData.city == "") {
      setErrorMessage('Please enter required fields.');
      return;
    }
    console.log(userData.fullName);
   

    // Check if username is already taken
    try {
      const response = await axios.get(`http://localhost:3000/auth/checkUsername?username=${userData.username}`);
      if (response.data.exists) {
        setErrorMessage('This username is already taken. Please choose another one.');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }

    // Check if email is already registered
    try {
      const response = await axios.get(`http://localhost:3000/auth/checkEmail?email=${userData.email}`);
      if (response.data.exists) {
        setErrorMessage('This email is already in use.');
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }

    // Check if username has enough chars 
    if(userData.username.length < 6){
      setErrorMessage('Username must be at least 6 characters.');
      return;
    } 

    // Check if password has enough chars 
    if(userData.password.length < 8){
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }
    
    // Confirm password
    if(confPass.localeCompare(userData.password) != 0){
      setErrorMessage('The passwords are not identical.');
      return;
    } 

    // Check email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!regex.test(userData.email)){
      setErrorMessage('Invalid email address.');
      return;
    } 

    // No errors
    setErrorMessage(null);

    /* Valid Details - save user in database */
    try {
      const response = await axios.post("http://localhost:3000/auth/register", userData);
      console.log(response.data);
      if(response.status == "200"){
        navigate("../HomePage", { state: {username: userData.username }});
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className='register-page'> 
      <div className='left-section'>   
          <img src={logo} alt='Logo' />  
          <div className='head-welcome'>
            <h1 className='head-login1'>Step into Sustainable Style </h1>
            <h1 className='head-login2'>Welcome to T-Share </h1>       
          </div>     
      </div> 

      <div className='right-section'>  
      <form onSubmit={handleSubmit} className='register-form'>
            <body className="App-header">
                  <div className="register-form-head">
                    Register
                  </div>

                  <label className='register-item-label'>
                    <div>Username: <span className="required">*</span></div>
                    <input type="text" name="username" placeholder="Enter Username" value={userData.username} onChange={handleInputChange} required maxLength="15"></input>
                  </label>

                  <label className='register-item-label'>
                    <div>Password: <span className="required">*</span></div>
                    <input type="password" name="password" placeholder="Enter Password" value={userData.password} onChange={handleInputChange} required maxLength="15"></input>
                  </label>

                  <label className='register-item-label'>
                    <div>Confirm Password: <span className="required">*</span></div>
                    <input type="password" name="confPassword" placeholder="Enter Password Again" required maxLength="15"></input>
                  </label>

                  <label className='register-item-label'>
                    <div>Email: <span className="required">*</span></div>
                    <input type="email" name="email" placeholder="Enter Email" value={userData.email} onChange={handleInputChange} required maxLength="50"></input>
                  </label>

                  <label className='register-item-label'>
                    <div>Full Name: <span className="required">*</span></div>
                    <input type="text" name="fullname" placeholder="Enter Full Name" value={userData.fullname} onChange={handleInputChange} required maxLength="25"></input>
                  </label>
                  
                  <label className='register-item-label'>
                    <div>City: <span className="required">*</span> </div>
                    <input type="text" name="city" placeholder="Enter City" value={userData.city} onChange={handleInputChange} maxLength="20"></input>
                  </label>
                  
                  <label className='register-item-label'>
                    <div>Weight:</div>
                    <input type="number" name="weight" placeholder="Enter Weight" value={userData.weight} onChange={handleInputChange} max="200"></input>
                  </label>

                  <label className='register-item-label'>
                    <div>Height:</div>
                    <input type="number" name="height" placeholder="Enter Height" value={userData.height} onChange={handleInputChange} max="200"></input>
                  </label>


                  <div className='did-login'>
                    <p> Already registered? <Link to='/' className="h">Click here</Link> to login</p>
                  </div>
                  <div className='register-btn'>
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                    <button type="submit" className='submit-button'>Register</button>
                  </div>
                </body>
          </form> 
        </div>
    </div>
  );
}
  
export default RegisterPage;