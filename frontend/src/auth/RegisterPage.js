import './RegisterPage.css'
import * as React from 'react';
import { useState } from "react";
import {Link, Route} from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import axios from "axios";


function RegisterPage() {
  let navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    fullname: "",
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
    if (userData.email == "" || userData.username == "" || userData.password == "" || userData.fullname == "" || confPass == "") {
      setErrorMessage('Please enter required fields.');
      return;
    }
   

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
      if(response.status == "201"){
        console.log("201");
        navigate("/ChatPage", { state: {username: userData.username }});
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
    <form onSubmit={handleSubmit}>
      <body className="App-header">
        <div className="row justify-content-md-center">
          <div className="regis">
            <div className="loggg">
              Register
            </div>
            <div>
              Username: *<input type="text" name="username" placeholder="Enter Username" value={userData.username} onChange={handleInputChange} required maxLength="15"></input>
            </div>
            <div>
              Password: *<input type="password" name="password" placeholder="Enter Password" value={userData.password} onChange={handleInputChange} required maxLength="15"></input>
            </div>
            <div>
              Confirm Password: *<input type="password" name="confPassword" placeholder="Enter Password" required maxLength="15"></input>
            </div>
            <div>
              Email: *<input type="email" name="email" placeholder="Enter Email" value={userData.email} onChange={handleInputChange} required maxLength="50"></input>
            </div>
            <div>
              Full Name: *<input type="text" name="fullname" placeholder="Enter Full Name" value={userData.fullname} onChange={handleInputChange} required maxLength="25"></input>
            </div>
            <div>
              Weight:<input type="number" name="weight" placeholder="Enter Weight" value={userData.weight} onChange={handleInputChange} max="200"></input>
            </div>
            <div>
              Height:<input type="number" name="height" placeholder="Enter Height" value={userData.height} onChange={handleInputChange} max="200"></input>
            </div>
            <div>
              City:<input type="text" name="city" placeholder="Enter City" value={userData.city} onChange={handleInputChange} maxLength="20"></input>
            </div>
            <div className='regi'>
              <p> Already registered? <Link to='/' className="h">Click here</Link> to login</p>
            </div>
            <div>
              {errorMessage && <div className="error-message">{errorMessage}</div>}
              <button type="submit" className="btn btn-lg btn-primary" onClick={handleSubmit}>
                Register
              </button>
            </div>
          </div>
        </div>
      </body>
    </form>
  );
}
  
export default RegisterPage;