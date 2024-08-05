import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Suggestions.css';

const Suggestions = ({ userId }) => {
    const [previousOrders, setPreviousOrders] = useState([]);
    const [recommendation, setRecommendation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [url, setUrl] = useState('https://food-delivery-app-backend-x79b.onrender.com'); // Adjust based on your environment

    useEffect(() => {
        const fetchPreviousOrders = async () => {
            try {
                const response = await axios.get(`${url}/api/gpt/orders/${userId}`);
                setPreviousOrders(response.data.flatMap(order => order.items.map(item => item.name)));
            } catch (error) {
                console.error('Failed to fetch previous orders:', error);
            }
        };

        fetchPreviousOrders();
    }, [userId, url]);

    const handleGetRecommendation = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(`${url}/api/gpt/recommend`, {
                userId,
                previousOrders, // Send previousOrders to your API
            });
            setRecommendation(response.data.recommendation);
        } catch (err) {
            setError('Failed to get recommendation');
            console.error('Error fetching recommendation:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="suggestions-container">
            <div className="suggestions-content">
                <p>Not sure what to order? Let us recommend something delicious!</p>
                <button
                    className="recommend-button"
                    onClick={handleGetRecommendation}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Get Recommendation'}
                </button>
                {error && <p className="error-message">{error}</p>}
                {recommendation && <p className="recommendation-message">{recommendation}</p>}
            </div>
        </div>
    );
};

export default Suggestions;
