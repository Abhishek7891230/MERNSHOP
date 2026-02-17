import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to MERN Shop</h1>
            <p>Your one-stop shop for everything.</p>
            <Link to="/products" className="btn-shop">Shop Now</Link>
        </div>
    );
};

export default Home;
