import { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '../utils/apiClient';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const { data } = await apiClient.get('/api/cart');
            setCart(data);
        } catch (error) {
            console.error(error);
        }
    };

    const addToCart = async (productId, quantity) => {
        if (!user) return;
        try {
            const { data } = await apiClient.post('/api/cart', { productId, quantity });
            setCart(data);
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async (id) => {
        if (!user) return;
        try {
            const { data } = await apiClient.delete(`/api/cart/${id}`);
            setCart(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
