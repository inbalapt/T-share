// OrderTab.js
import React from 'react';
import './OrderTab.css';

const OrderTab = ({ order }) => {
    const currentTime = new Date(order.time);
    const formattedDate = currentTime.toLocaleDateString();
    return (
        <div className="order-tab">
            <div className="order-tab-content">
                <div className="order-tab-section order-tab-img-section">
                    <img className="order-tab-img" src={`https://drive.google.com/uc?export=view&id=${order.pictures[0]}`} alt={order.description} />
                </div>
                <div className="order-tab-section">{order.description}</div>
                <div className="order-tab-section">${order.price}</div>
                <div className="order-tab-section">{formattedDate}</div>
                <div className="order-tab-section">{order.sellerFullName}</div>
            </div>
        </div>
    );
};

export default OrderTab;
