require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const fs = require('fs');

const testRegistration = async () => {
    await connectDB();

    const username = 'testuser_' + Date.now();
    const email = 'test' + Date.now() + '@example.com';
    const password = 'password123';

    try {
        console.log('Attempting to create user...');
        const user = await User.create({
            username,
            email,
            password,
        });
        console.log('User created:', user);
    } catch (error) {
        fs.writeFileSync('error_full.txt', error.stack);
        console.log('Error written to error_full.txt');
    } finally {
        // await mongoose.disconnect();
        // Keep checking if error happens
    }
};

testRegistration();
