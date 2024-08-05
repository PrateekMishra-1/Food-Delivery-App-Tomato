import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import MapComponent from '../../components/Map/MapComponent'; // Adjust the import based on your directory structure

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showMap, setShowMap] = useState(false);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
        setData(response.data.data);
    };

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    const handleTrackOrder = (order) => {
        if (order.status === "Delivered") {
            setShowMap(false);
            return;
        }

        if (selectedOrder && selectedOrder._id === order._id && showMap) {
            setShowMap(false); // Close the map if the same order is clicked again
        } else {
            setSelectedOrder(order);
            setShowMap(true);
        }
    };

    const origin = { lat: 21.171289871074084, lng: 72.78855080698763 };
    const destination = { lat: 21.167569403658344, lng: 72.78477454184639 };

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {data.map((order, index) => (
                    <div key={index} className='my-orders-order'>
                        <img src={assets.parcel_icon} alt="" />
                        <p>{order.items.map((item, index) => {
                            if (index === order.items.length - 1) {
                                return item.name + " x " + item.quantity;
                            }
                            else {
                                return item.name + " x " + item.quantity + ", ";
                            }
                        })}</p>
                        <p>${order.amount}.00</p>
                        <p>Items : {order.items.length}</p>
                        <p><span>&#x25cf; </span><b>{order.status}</b></p>
                        <button onClick={() => handleTrackOrder(order)} disabled={order.status === "Delivered"}>
                            {selectedOrder && selectedOrder._id === order._id && showMap ? 'Hide Map' : 'Track Order'}
                        </button>
                    </div>
                ))}
            </div>
            {showMap && selectedOrder && (
                <div className='map-container'>
                    <MapComponent origin={origin} destination={destination} />
                </div>
            )}
        </div>
    );
};

export default MyOrders;
