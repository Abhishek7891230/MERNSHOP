# MERNSHOP - E-Commerce Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce application with user authentication, product catalog, shopping cart, and order management.

## Project Structure

```
MERNSHOP/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth, Cart)
│   │   ├── utils/         # API client and utilities
│   │   ├── styles/        # CSS styles
│   │   └── main.jsx
│   ├── .env.local         # Development environment
│   ├── .env.production    # Production environment
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/            # Database configuration
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── controllers/       # Route handlers
│   ├── .env               # Environment variables
│   └── server.js
│
├── DEPLOYMENT.md          # Deployment guide
└── README.md
```

## Features

✅ **User Authentication**
- Secure user registration and login
- JWT token-based authentication
- Local storage for session management

✅ **Product Management**
- Paginated product listings
- Infinite scroll functionality
- Product details display

✅ **Shopping Cart**
- Add/remove items from cart
- Real-time cart updates
- Cart persistence

✅ **Order Management**
- Place orders
- View order history
- Order status tracking
- Pagination support

✅ **Security**
- Password hashing with bcryptjs
- JWT authentication
- Rate limiting
- CORS configuration

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- npm or yarn

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd MERNSHOP
```

#### 2. Backend Setup
```bash
cd server
npm install
```

Create `.env` file with:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

#### 3. Frontend Setup
```bash
cd ../client
npm install
```

Create `.env.local` file with:
```
VITE_API_URL=http://localhost:5000
```

### Development

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products?page=1&limit=10` - Get paginated products

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart

### Orders
- `GET /api/orders?page=1&limit=5` - Get user orders
- `POST /api/orders` - Create new order

## Environment Variables

### Client
```
VITE_API_URL          # API base URL (default: http://localhost:5000)
```

### Server
```
PORT                  # Server port (default: 5000)
MONGO_URI            # MongoDB Atlas connection string (REQUIRED)
JWT_SECRET           # JWT signing secret (REQUIRED)
CLIENT_URL           # Frontend URL for CORS (default: http://localhost:3000)
```

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deployment Summary

1. **Backend**: Deploy to Heroku, Render, Railway, or Vercel
2. **Frontend**: Deploy to Vercel, Netlify, or GitHub Pages
3. **Database**: MongoDB Atlas (already configured)

### Important Deployment Steps

1. Update `.env.production` with production API URL
2. Set environment variables on hosting platform
3. Update CORS origin in server configuration
4. Build frontend: `npm run build`
5. Test all API connections

## Key Technologies

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Navigation
- **CSS3** - Styling

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## Security Features

✅ Password hashing with bcryptjs
✅ JWT token authentication
✅ Rate limiting on API endpoints
✅ CORS protection
✅ Environment variable management
✅ Secure MongoDB Atlas connection

## File Management

### Important: Do NOT Commit
- `.env` files (add to .gitignore)
- `node_modules/`
- Build output (`dist/`, `build/`)

### Safe for Commit
- Source code
- `.gitignore`
- `package.json`
- `.env.example` (without secrets)
- Documentation

## Troubleshooting

### CORS Errors
- Check `CLIENT_URL` matches frontend domain
- Verify browser console for specific errors
- Ensure server CORS configuration is correct

### API Connection Issues
- Verify `VITE_API_URL` environment variable
- Check server is running
- Test endpoint with Postman or curl

### MongoDB Connection Failed
- Verify connection string format
- Check MongoDB Atlas network access settings
- Ensure IP whitelist allows your connection

### Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version compatibility
- Review console error messages

## Performance Optimization

1. **Frontend**
   - Code splitting with dynamic imports
   - Lazy loading components
   - Image optimization
   - Minification on build

2. **Backend**
   - Database indexing
   - Query optimization
   - Connection pooling
   - Response caching

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - feel free to use for personal or commercial projects

## Support

For issues, check:
- Browser console (frontend errors)
- Server logs (backend errors)
- DEPLOYMENT.md (deployment help)

---

**Ready to Deploy?** See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.
