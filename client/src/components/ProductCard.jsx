import { useContext } from 'react';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);

    const handleAddToCart = () => {
        if (user) {
            addToCart(product._id, 1);
            alert('Added to cart!');
        } else {
            alert('Please login to add items to cart.');
        }
    };

    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">${product.price}</p>
                <button onClick={handleAddToCart} className="btn-add-cart">Add to Cart</button>
            </div>
        </div>
    );
};

export default ProductCard;
