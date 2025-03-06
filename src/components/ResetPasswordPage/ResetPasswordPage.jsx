import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import styles from '../AuthPage/AuthPage.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = queryString.parse(location.search);

    useEffect(() => {
        document.title = "GMA Portal || Reset Password";
        if (!token) {
            setError("Invalid or missing token.");
        }
    }, [token]);

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[\W])(?=.*\d).{10,}$/;
        return regex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!token) {
            setError("Invalid or missing token.");
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must have at least 10 characters, one capital letter, one special character, and one number.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            console.log("📤 Sending Reset Password Request:", { token, new_password: password });

            const response = await fetch('http://127.0.0.1:8000/api/reset-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, new_password: password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('✅ Password reset successfully! Redirecting to login...');
                setTimeout(() => navigate('/'), 3000);
            } else {
                setError(data.error || '❌ Failed to reset password.');
            }
        } catch (err) {
            console.error("❌ Reset Password Error:", err);
            setError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className={styles['outer-container']}>
            <div className={styles['inner-container']}>
                <div className={styles['card']}>
                    <form className={styles['form-container']} onSubmit={handleSubmit}>
                        <h1>Reset Password</h1>
                        {error && <p className={styles['error-text']}>{error}</p>}
                        {success && <p className={styles['success-text']}>{success}</p>}

                        <div className={styles['row']}>
                            <div className={styles['input-group']}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="New Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <span className={styles['view-password-text']}>View Password: </span>
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                    className={styles['eye-icon']}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </div>
                        </div>

                        <div className={styles['row']}>
                            <div className={styles['input-group']}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <span className={styles['view-password-text']}>View Password: </span>
                                <FontAwesomeIcon
                                    icon={showConfirmPassword ? faEyeSlash : faEye}
                                    className={styles['eye-icon']}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                />
                            </div>
                        </div>

                        <button type="submit">Reset</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
