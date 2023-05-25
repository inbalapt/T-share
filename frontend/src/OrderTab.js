// OrderTab.js
import React from 'react';
import './OrderTab.css';

const OrderTab = ({ order }) => {
    return (
        <div className="order-tab">
            <div className="order-tab-content">
                <div className="order-tab-section order-tab-img-section">
                    <img className="order-tab-img" src={order.image} alt={order.description} />
                </div>
                <div className="order-tab-section">{order.description}</div>
                <div className="order-tab-section">${order.price}</div>
                <div className="order-tab-section">{new Date(order.date).toLocaleDateString()}</div>
                <div className="order-tab-section">{order.seller}</div>
            </div>
        </div>
    );
};

export default OrderTab;
