import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import '../styles/Cart.css';

const Cart = () => {
    const { cart, removeFromCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const totalPrice = cart.reduce((acc, item) => acc + item.quantity * item.product.price, 0).toFixed(2);

    const checkoutHandler = async () => {
        try {
            const orderItems = cart.map(item => ({
                product: item.product._id,
                name: item.product.name,
                image: item.product.image,
                price: item.product.price,
                qty: item.quantity
            }));

            await apiClient.post('/api/orders', {
                orderItems,
                totalPrice,
            });

            alert('Order Placed Successfully!');
            navigate('/orders');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Checkout failed');
        }
    };

    if (cart.length === 0) {
        return <div className="cart-container"><h2>Your cart is empty</h2></div>;
    }

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            <div className="cart-items">
                {cart.map((item) => (
                    <div key={item.product._id} className="cart-item">
                        <img src={item.product.image} alt={item.product.name} />
                        <div className="cart-item-details">
                            <h3>{item.product.name}</h3>
                            <p>${item.product.price}</p>
                            <p>Qty: {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.product._id)} className="btn-remove">Remove</button>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Total: ${totalPrice}</h3>
                <button onClick={checkoutHandler} className="btn-checkout">Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
