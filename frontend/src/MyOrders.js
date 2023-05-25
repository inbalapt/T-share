// MyOrders.js
import React, { useState, useEffect } from 'react';
import OrderTab from './OrderTab';
import './MyOrders.css';
import logo from './logo.jpg';

const MyOrders = ({ username }) => {
    // for testing
    let tempOrders =[{image: logo , description: 'floral dress', price:'50' , date: '25/05/2023' , seller: 'Inbal Apt'},
    {image: logo , description: 'floral dress', price:'70' , date: '25/05/2023' , seller: 'Inbal Apt'},
    {image: logo , description: 'floral dress', price:'80' , date: '25/05/2023' , seller: 'Inbal Apt'},]


    const [orders, setOrders] = useState([]);

    /*
    useEffect(() => {
        // TODO: Replace this with actual logic to fetch orders from the server
        async function fetchOrders() {
            const response = await fetch('/api/orders', { username });
            const data = await response.json();
            setOrders(data);
        }
        fetchOrders();
    }, [username]);
    */
    useEffect(() => {
        // TODO: Fetch orders from the server and set them in the state
    }, []);


    return (
        <div className="my-orders">
            <h1>My Orders</h1>
            <div className="my-orders-headers">
                <span className="my-orders-header">Description:</span>
                <span className="my-orders-header">Price:</span>
                <span className="my-orders-header">Date:</span>
                <span className="my-orders-header">Seller:</span>
            </div>
            {tempOrders.map(order => (
                <OrderTab key={order.id} order={order} />
            ))}
        </div>
    );
};

export default MyOrders;
