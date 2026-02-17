import { useContext, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Login.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const { verifyEmail } = useContext(AuthContext);
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const email = searchParams.get('email');
        const token = searchParams.get('token');

        const runVerification = async () => {
            if (!email || !token) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                const data = await verifyEmail(email, token);
                setStatus('success');
                setMessage(data.message || 'Email verified successfully. You can now login.');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Email verification failed');
            }
        };

        runVerification();
    }, [searchParams, verifyEmail]);

    return (
        <div className="auth-container">
            <h2>Email Verification</h2>
            {status === 'verifying' && <div className="auth-note">{message}</div>}
            {status === 'success' && <div className="auth-success">{message}</div>}
            {status === 'error' && <div className="auth-error">{message}</div>}
            <div className="auth-redirect">
                <p><Link to="/login">Go to Login</Link></p>
            </div>
        </div>
    );
};

export default VerifyEmail;
