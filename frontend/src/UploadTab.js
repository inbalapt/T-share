// OrderTab.js
import React from 'react';
import './OrderTab.css';
import axios from 'axios';

const UploadTab = ({ upload, setUpdateProducts, uploads, setUploads}) => {

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

    return (
        
        <div className="order-tab">
            <div className="order-tab-content">
                <div className="order-tab-section order-tab-img-section">
                    <img className="order-tab-img" src={`https://drive.google.com/uc?export=view&id=${upload.pictures[0]}`} alt={upload.description} />
                </div>
                <div className="order-tab-section">{upload.description}</div>
                <div className="order-tab-section">${upload.price}</div>
                <div className="order-tab-section">{upload.condition}</div>
                <div className="order-tab-section">
                    <i class="bi bi-trash3" onClick={deleteItem}></i>
                </div>
            </div>
            
        </div>
    
    );
};

export default UploadTab;