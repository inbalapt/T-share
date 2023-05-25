// MyDetails.js
import React, { useState, useEffect } from 'react';
import './MyDetails.css';

const MyDetails = ({username}) => {
    const [editMode, setEditMode] = useState(false);
    const [userDetails, setUserDetails] = useState({
        city: '',
        height: '',
        weight: '',
        credit: '',
        email: '',
    });

    useEffect(() => {
        // TODO: Fetch user data from the server and set it in the state
    }, []);

    const handleInputChange = (event) => {
        setUserDetails({
            ...userDetails,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // TODO: Add logic to send the updated data to the server
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
                <button type="submit" className="my-details-button">Save Changes</button>
            </form>
        );
    }

    return (
        <div className="my-details-view">
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
