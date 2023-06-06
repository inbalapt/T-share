// MyOrders.js
import React, { useState, useEffect } from 'react';
import UploadTab from './UploadTab';
import './MyOrders.css';
import logo from './logo.jpg';
import axios from 'axios';

const getUploads = async(username,setUploads)=>{
    try{
        const response = await axios.get(`http://localhost:3000/getUploads?username=${username}`);
        setUploads(response.data);
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
    }
}

const MyUploads = ({ username, setUpdateProducts, updateProducts }) => {

    console.log("username " + username);
    const [uploads, setUploads] = useState([]);
    

    useEffect(()=>{
        getUploads(username,setUploads);
        setUpdateProducts(false)
    }, []);

    useEffect(()=>{
        getUploads(username,setUploads);
        setUpdateProducts(false)
    }, [updateProducts]);
    

    console.log(uploads);

    return (
        <div className="my-uploads">
            <h1>My Products</h1>
            {uploads.length != 0 && (<div className="my-orders-headers">
                <span className="my-orders-header">Description:</span>
                <span className="my-orders-header">Price:</span>
                <span className="my-orders-header">Condition:</span>
                <span className="my-orders-header">Bought:</span>
                <span className="my-orders-header">Options:</span>
            </div>)}
            {uploads.map(upload => (
                <UploadTab key={upload._id} upload={upload} setUpdateProducts={setUpdateProducts} uploads={uploads} setUploads={setUploads}/>
            ))}
        </div>
    );
};

export default MyUploads;
