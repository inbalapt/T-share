// MyDetails.js
import React, { useState, useEffect } from 'react';
import './MyDetails.css';
import axios from 'axios';

const getUserDetails = async(username,setUserDetails)=>{
    try {
        const response = await axios.get(`http://localhost:3000/getUserDetails?username=${username}`);
        console.log(response.data)
        setUserDetails((prevUserDetails) => ({
            ...prevUserDetails,
            city: response.data.city,
            height: response.data.height,
            weight: response.data.weight,
            credit: response.data.credit,
            email: response.data.email,
            image: response.data.image
          }));
        return response.data.fullName;
      } catch (error) {
        console.error(error);
      }
}


const MyDetails = ({username}) => {
    const [editMode, setEditMode] = useState(false);
    const [userDetails, setUserDetails] = useState({
        city: '',
        height: '',
        weight: '',
        credit: '',
        email: '',
        image: '',
    });

    useEffect(() => {
        getUserDetails(username, setUserDetails);
        console.log(userDetails);
        // TODO: Fetch user data from the server and set it in the state
    }, []);

    const handleInputChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageChange = (event) => {  
        // if there is more than 4 images to the product
        if (event.target.files.length > 1) {
            alert("You can only upload 1 image.");
            event.target.value = null;  // <-- Clear the selected files
           
        } else {
            setUserDetails({
                ...userDetails,
                image: event.target.files[0],
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Add logic to send the updated data to the server
        
        const uploadChangesToServer = async () => {
            try {
                const formData = new FormData();
                formData.append('username', username);
                if(userDetails.city !== null){
                    formData.append('city', userDetails.city);
                } 
                if(userDetails.email !== null){
                    formData.append('email', userDetails.email);
                }
                if(userDetails.height !== null){
                    formData.append('height', userDetails.height);
                }
                if(userDetails.weight !== null){
                    formData.append('weight', userDetails.weight);
                }
               
                if (userDetails.image !== null) {
                    console.log("good");
                    formData.append('image', userDetails.image);
                }

                const response = await axios.post(`http://localhost:3000/updateUserDetails`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
        
               console.log(response.data);
            } catch (error) {
                console.log('Error updating user:', error);
                // Handle error case, e.g., show an error message to the user
            }
        
        }
        uploadChangesToServer();
        setEditMode(false);
    };

    if (editMode) {
        return (
            <form onSubmit={handleSubmit} className="my-details-form">
                <h1 className="my-details-title">My Details</h1>
                <label className="my-details-label">
                    City:
                    <input type="text" name="city" value={userDetails.city} onChange={handleInputChange} />
                </label>
                <label className="my-details-label">
                    Height:
                    <input type="number" name="height" value={userDetails.height} onChange={handleInputChange} />
                </label>
                <label className="my-details-label">
                    Weight:
                    <input type="number" name="weight" value={userDetails.weight} onChange={handleInputChange} />
                </label>
                <label className="my-details-label">
                    Email:
                    <input type="email" name="email" value={userDetails.email} onChange={handleInputChange} />
                </label>
                <label className="my-details-label">
                Profile Image:
                <input type="file" name="images" onChange={handleImageChange} className="upload-item-input"/>
            </label>
                <button type="submit" className="my-details-button">Save Changes</button>
            </form>
        );
    }

    return (
        <div className="my-details-view" >
            <h1 className="my-details-title">My Details</h1>
            <p className="my-details-item">City: {userDetails.city}</p>
            <p className="my-details-item">Height: {userDetails.height}</p>
            <p className="my-details-item">Weight: {userDetails.weight}</p>
            <p className="my-details-item">Email: {userDetails.email}</p>
            <button onClick={() => setEditMode(true)} className="my-details-button">Edit</button>
        </div>
    );
};

export default MyDetails;
