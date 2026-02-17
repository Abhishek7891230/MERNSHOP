import { createContext, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await apiClient.post('/api/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    };

    const register = async (username, email, password, confirmPassword) => {
        const { data } = await apiClient.post('/api/auth/register', {
            username, email, password, confirmPassword
        });
        return data;
    };

    const verifyEmail = async (email, token) => {
        const { data } = await apiClient.post('/api/auth/verify-email', { email, token });
        return data;
    };

    const googleLogin = async (credential) => {
        const { data } = await apiClient.post('/api/auth/google', { credential });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, verifyEmail, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
