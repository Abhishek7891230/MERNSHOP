const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const getClientAppUrl = () => {
    if (process.env.CLIENT_APP_URL) {
        return process.env.CLIENT_APP_URL;
    }

    const clientUrls = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);

    return clientUrls[0] || 'http://localhost:5173';
};

const getTransporter = () => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const sendVerificationEmail = async (email, username, token) => {
    const appUrl = getClientAppUrl();
    const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    const transporter = getTransporter();
    if (!transporter) {
        console.log(`Email verification link for ${email}: ${verificationUrl}`);
        return;
    }

    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: email,
        subject: 'Verify your MERN Shop account',
        html: `
            <h2>Welcome to MERN Shop, ${username}!</h2>
            <p>Please verify your email by clicking the link below:</p>
            <p><a href="${verificationUrl}">Verify Email</a></p>
            <p>This link expires in 1 hour.</p>
        `,
    });
};

const createAuthPayload = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email,
    token: generateToken(user._id),
    cart: user.cart || [],
    isVerified: user.isVerified,
});

// @desc    Register new user and send email verification
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        let { username, email, password, confirmPassword } = req.body;

        email = email.toLowerCase().trim();
        username = username.trim();

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        const user = await User.create({
            username,
            email,
            password,
            isVerified: false,
            verificationToken: hashedToken,
            verificationTokenExpires: new Date(Date.now() + 60 * 60 * 1000),
        });

        await sendVerificationEmail(user.email, user.username, rawToken);

        return res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error: ' + error.message });
    }
};

// @desc    Verify user email
// @route   POST /api/auth/verify-email
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { email, token } = req.body;
        if (!email || !token) {
            return res.status(400).json({ message: 'Email and token are required' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            verificationToken: hashedToken,
            verificationTokenExpires: { $gt: new Date() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification link' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;
        await user.save();

        return res.json({ message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase().trim();

        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in' });
        }

        return res.json(createAuthPayload(user));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate or register user with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: 'Google credential is required' });
        }

        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({ message: 'Google login is not configured on the server' });
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ message: 'Invalid Google token payload' });
        }

        const email = payload.email.toLowerCase().trim();
        const usernameSeed = (payload.name || email.split('@')[0]).replace(/\s+/g, '');
        let user = await User.findOne({ email });

        if (!user) {
            const baseUsername = usernameSeed.slice(0, 18) || 'user';
            let candidate = baseUsername;
            let suffix = 1;

            while (await User.findOne({ username: candidate })) {
                candidate = `${baseUsername}${suffix}`;
                suffix += 1;
            }

            user = await User.create({
                username: candidate,
                email,
                password: crypto.randomBytes(24).toString('hex'),
                googleId: payload.sub || null,
                isVerified: true,
            });
        } else {
            if (!user.isVerified) {
                user.isVerified = true;
            }
            if (!user.googleId && payload.sub) {
                user.googleId = payload.sub;
            }
            await user.save();
        }

        return res.json(createAuthPayload(user));
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Google authentication failed' });
    }
};

module.exports = { registerUser, verifyEmail, loginUser, googleLogin };
