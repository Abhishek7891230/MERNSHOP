require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const connectDB = require('./config/db');

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        // await User.deleteMany(); // Keep users for now

        const products = [];
        const categories = ['Electronics', 'Clothing', 'Books', 'Home'];

        for (let i = 1; i <= 60; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            products.push({
                name: `Product ${i}`,
                image: 'https://via.placeholder.com/150',
                description: `Description for Product ${i}`,
                category: category,
                price: Math.floor(Math.random() * 100) + 10,
                countInStock: Math.floor(Math.random() * 20),
                rating: Math.floor(Math.random() * 5) + 1,
            });
        }

        await Product.insertMany(products);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
