// OrderTab.js
import React, { useEffect, useState } from 'react';
import './OrderTab.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Cursor } from 'mongoose';

const UploadTab = ({ upload, setUpdateProducts, uploads, setUploads, username}) => {
    const [uploadIsBought, setUploadIsBought] = useState("");
    const navigate = useNavigate();

    useEffect(()=>{
        if(upload.isBought){
            setUploadIsBought("yes");
        } else {
            setUploadIsBought("no");
        }
        
    },[upload])
    const deleteItem = async ()=>{
        try {
            const response = await axios.delete(`http://localhost:3000/deleteItem?itemId=${upload._id}&username=${upload.sellerUsername}`);
            console.log(response.data);
            setUploads(uploads.filter((item) => item._id !== upload._id));
            setUpdateProducts(true);
            return;
        }
        catch (error) {
            console.log(error);
        }
    }

    function handleItem(){
        navigate(`/item/${upload._id}`, { state: { username: username} });
    }

    return (
        
        <div className="order-tab clickItem" onClick={handleItem}>
            <div className="order-tab-content">
                <div className="order-tab-section order-tab-img-section">
                    <img className="order-tab-img" src={`https://drive.google.com/uc?export=view&id=${upload.pictures[0]}`} alt={upload.description} />
                </div>
                <div className="order-tab-section">{upload.description}</div>
                <div className="order-tab-section">${upload.price}</div>
                <div className="order-tab-section">{upload.condition}</div>
                <div className="order-tab-section">{uploadIsBought}</div>
                <div className="order-tab-section">
                    <i class="bi bi-trash3" onClick={deleteItem}></i>
                </div>
            </div>
            
        </div>
    
    );
};

export default UploadTab;
