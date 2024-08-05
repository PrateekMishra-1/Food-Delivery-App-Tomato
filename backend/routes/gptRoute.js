import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Order from '../models/Order.js';
import 'dotenv/config';

const gptRoute = express.Router();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Predefined list of items
const itemList = [
    "Greek Salad", "Veg Salad", "Clover Salad", "Chicken Salad", "Lasagna Rolls", "Peri Peri Rolls", "Chicken Rolls", "Veg Rolls", "Ripple Ice Cream", "Fruit Ice Cream",
    "Jar Ice Cream", "Vanilla Ice Cream", "Chicken Sandwich", "Vegan Sandwich", "Grilled Sandwich", "Bread Sandwich ", "Cup Cake", "Vegan Cake",
    "Butterscotch Cake", "Sliced Cake", "Garlic Mushroom", "Fried Cauliflower", "Mix Veg Pulao", "Rice Zucchini", "Cheese Pasta", "Tomato Pasta", "Creamy Pasta",
    "Chicken Pasta", "Butter Noodles", "Veg Noodles", "Somen Noodles", "Cooked Noodles"
];

// Create a new order
gptRoute.post('/create', async (req, res) => {
    const { userId, items } = req.body;

    try {
        const newOrder = new Order({ userId, items });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order', error });
    }
});

// Get orders for a user
gptRoute.get('/orders/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const orders = await Order.find({ userId });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get orders', error });
    }
});

// Get Gemini recommendation
gptRoute.post('/recommend', async (req, res) => {
    const { userId } = req.body;

    try {
        const orders = await Order.find({ userId });
        const previousOrders = orders.flatMap(order => order.items.map(item => item.name));

        let prompt;
        if (previousOrders && previousOrders.length > 0) {
            prompt = `Based on the previous orders: ${previousOrders.join(', ')}, suggest a food item from the following list: ${itemList.join(', ')}.`;
        } else {
            prompt = `Suggest a random food item from the following list: ${itemList.join(', ')}. and just give me the name and write nothing else`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recommendation = await response.text();

        const formattedRecommendation = `We think you should try: ${recommendation}`;

        res.json({ recommendation: formattedRecommendation });
    } catch (error) {
        console.error('Error fetching recommendation from Gemini:', error);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data });
        } else {
            res.status(500).json({ error: 'Failed to get recommendation' });
        }
    }
});

export default gptRoute;
