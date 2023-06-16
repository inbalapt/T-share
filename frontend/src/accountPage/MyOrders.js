// MyOrders.js
import React, { useState, useEffect } from 'react';
import OrderTab from './OrderTab';
import './MyOrders.css';
import axios from 'axios';

const getOrders = async(username,setOrders)=>{
    try{
        const response = await axios.get(`http://localhost:3000/item/getOrders?username=${username}`);
        setOrders(response.data);
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error(error);
    }
}

const MyOrders = ({ username }) => {
    // for testing
    
    console.log("username " + username);
    const [orders, setOrders] = useState([]);

    useEffect(()=>{
        getOrders(username,setOrders);
    }, []);

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
   

    return (
        <div className="my-orders">
            <h1>My Orders</h1>
            {orders!== [] && (<div className="my-orders-headers">
                <span className="my-orders-header">Description:</span>
                <span className="my-orders-header">Price:</span>
                <span className="my-orders-header">Date:</span>
                <span className="my-orders-header">Seller:</span>
            </div>)}
            {orders.map(order => (
                <OrderTab key={order.id} order={order} />
            ))}
        </div>
    );
};

export default MyOrders;
