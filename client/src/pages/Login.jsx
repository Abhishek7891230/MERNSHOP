import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import AuthContext from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, googleLogin } = useContext(AuthContext);
    const navigate = useNavigate();
    const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            await googleLogin(credentialResponse.credential);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Google login failed');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn-auth">Login</button>
            </form>
            <div className="auth-divider">or</div>
            {hasGoogleClientId ? (
                <div className="google-login-wrapper">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google login failed')}
                    />
                </div>
            ) : (
                <div className="auth-note">Google login is disabled. Add VITE_GOOGLE_CLIENT_ID to enable it.</div>
            )}
            <div className="auth-redirect">
                <p>New customer? <Link to="/signup">Register</Link></p>
            </div>
        </div>
    );
};

export default Login;
