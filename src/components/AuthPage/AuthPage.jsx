import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import logoimage from '../assets/20 year logo.png';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [error, setError] = useState('');
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
            document.title = "GMA Portal";  // Change this to what you want
        }, []);

    const handleToggle = (e) => {
        e.preventDefault();
        setError("");
        setIsLogin(!isLogin);
        setIsForgotPassword(false);
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setIsForgotPassword(true);
    };

    const handleBackToLogin = (e) => {
        e.preventDefault();
        setIsForgotPassword(false);
        setForgotPasswordSuccess(false);
        setIsLogin(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isForgotPassword) {
            try {
                console.log("Sending Forgot Password request for:", email);
                const response = await fetch('https://gmawebapp-backend.onrender.com/api/forgot-password/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Server Error: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                console.log("Response status:", response.status);

                if (response.ok) {
                    console.log("Forgot password email sent successfully.");
                    setForgotPasswordSuccess(true);
                } else {
                    const errorData = await response.json();
                    console.log("Error Response:", errorData);
                    setError('Failed to send reset email. Please try again.');
                }
            } catch (err) {
                console.error("Error connecting to server:", err);
                setError('Failed to connect to the server');
            }
        }
        else if (isLogin) {
            // **Login Flow**
            try {
                localStorage.setItem('userEmail', email);
                console.log("Sending Login Request:", { email, password });
    
                const response = await fetch("https://gmawebapp-backend.onrender.com/api/login/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    console.log("✅ Login Successful:", data);
                    localStorage.setItem("token", data.token);
                    navigate("/user-portal");
                } else {
                    setError(data.error || "Login failed");
                }
            } catch (err) {
                console.error("Server error:", err);
                setError("Failed to connect to the server");
            }
        } else {
            // **Registration Flow**
            try {
                console.log("Checking if contact exists...");
                
                const findContactResponse = await fetch("https://gmawebapp-backend.onrender.com/api/contact/find/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_number: idNumber,
                        email: email,
                        mobile_number: mobileNumber,
                    }),
                });
    
                const contactData = await findContactResponse.json();
    
                let contactId = null;
    
                if (findContactResponse.ok && contactData.contact_id) {
                    contactId = contactData.contact_id;
                    console.log(`✅ Contact Found: ${contactId}`);
                } else {
                    console.log("⚠️ Contact not found, proceeding with registration...");
                }
    
                const registerResponse = await fetch("https://gmawebapp-backend.onrender.com/api/register/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        firstname: firstName,
                        lastname: lastName,
                        mobilenumber: mobileNumber,
                        email,
                        password,
                        id_number: idNumber,
                    }),
                });
    
                const registerData = await registerResponse.json();
    
                if (registerResponse.ok) {
                    alert("Registration successful! Redirecting...");
                    localStorage.setItem("token", registerData.token);
                    navigate("/user-portal");
                } else {
                    setError("This email is already registered on the system. Please log in.");
                }
            } catch (err) {
                console.error("Server error:", err);
                setError("Failed to connect to the server");
            }
        }
    };

    return (
        <div className={styles['outer-container']}>
            <div className={styles['inner-container']}>
                <div
                    className={`${styles['card']} ${
                        isForgotPassword
                            ? styles['move-right']
                            : isLogin
                            ? styles['move-left']
                            : styles['move-right']
                    }`}
                >
                    <form className={styles['form-container']} onSubmit={handleSubmit}>
                        <img
                            src={logoimage}
                            alt="20 Year Logo"
                            className={styles['logo-image']}
                        />
                        <h1>
                            {isForgotPassword
                                ? 'Forgot Password'
                                : isLogin
                                ? 'Login'
                                : 'Register'}
                        </h1>
                        {isForgotPassword ? (
                            forgotPasswordSuccess ? (
                                <>
                                    <p className={styles['success-message']}>
                                        If the email exists, a reset link has been sent.
                                    </p>
                                    <p className={styles['back-to-login-text']}>
                                        <a
                                            href="#"
                                            onClick={handleBackToLogin}
                                            className={styles['back-to-login-link']}
                                        >
                                            Return to Login
                                        </a>
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div className={styles['row']}>
                                        <div className={styles['input-group']}>
                                            <input
                                                type="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit">Reset</button>
                                    <p className={styles['back-to-login-text']}>
                                        <a
                                            href="#"
                                            onClick={handleBackToLogin}
                                            className={styles['back-to-login-link']}
                                        >
                                            Back to Login
                                        </a>
                                    </p>
                                </>
                            )
                        ) : isLogin ? (
                            <>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                {error && <p className={styles['error']}>{error}</p>}
                                <p className={styles['forgot-password']}>
                                    <a
                                        href="#"
                                        onClick={handleForgotPassword}
                                        className={styles['forgot-password-link']}
                                    >
                                        Forgot Password?
                                    </a>
                                </p>
                                <button type="submit">Login</button>
                                <p className={styles['register-text']}>
                                    Don't have an account?{' '}
                                    <a
                                        href="#"
                                        onClick={handleToggle}
                                        className={styles['toggle-link']}
                                    >
                                        Register Here
                                    </a>
                                </p>
                            </>
                        ) : (
                            <>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles['input-group']}>
                                        <input
                                            type="text"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input
                                            type="text"
                                            placeholder="Mobile Number"
                                            value={mobileNumber}
                                            onChange={(e) => setMobileNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input
                                            type="text"
                                            placeholder="ID Number"
                                            value={idNumber}
                                            onChange={(e) => setIdNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className={styles['input-group']}>
                                        <input
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {password !== confirmPassword && (
                                    <p className={styles['error']}>Passwords do not match.</p>
                                )}

                                <p className={styles['login-text']}>
                                    Already Registered?{' '}
                                    <a
                                        href="#"
                                        onClick={handleToggle}
                                        className={styles['toggle-link']}
                                    >
                                        Log in Here
                                    </a>
                                </p>
                                {error && <p className={styles['error']}>{error}</p>}
                                <button type="submit">Create</button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
