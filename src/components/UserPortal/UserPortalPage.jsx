import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserPortalPage.module.css';
import logoimage from '../assets/20 year logo.png';

const UserPortalPage = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [userAccess, setUserAccess] = useState([]);
    const [loadingAccess, setLoadingAccess] = useState(true); // ✅ Add loading state
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "GMA Portal || User Portal";
        const fetchUserAccess = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("🚨 No token found. Redirecting to login.");
                navigate("/");
                return;
            }

            try {
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const email = decodedToken.email || null;
                const contact_id = decodedToken.contact_id || null;

                console.log("📡 Fetching user access levels...", { email, contact_id });

                if (!email) {
                    console.error("❌ Email is missing in token!");
                    setLoadingAccess(false);
                    return;
                }

                const response = await fetch("https://gmawebapp-backend.onrender.com/api/contact/determine-access/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email, contact_id })
                });

                const data = await response.json();

                if (response.ok) {
                    setUserAccess(data.access || []);
                    console.log("✅ User access levels:", data.access);
                } else {
                    console.error("❌ Error fetching user access:", data.error || "Failed to fetch access");
                }
            } catch (err) {
                console.error("🚨 Network error:", err);
            } finally {
                setLoadingAccess(false); // ✅ Stop loading once request completes
            }
        };

        fetchUserAccess();
    }, [navigate]);

    const handleOwnerPortalClick = () => {
        navigate('/owner-portal');
    };

    const handleTrusteePortalClick = () => {
        navigate('/trustee-portal');
    };

    const handleContractorPortalClick = () => {
        navigate('/contractor-portal');
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div>
        <nav className={`${styles.navbar} ${isDropdownVisible ? styles.navbarDropdownActive : ""}`}>
        <div className={styles.logo}>
            <img src={logoimage} alt="20 Year Logo" className={styles.logoImage} />
        </div>
        <div className={styles.title}>
            <h1>User Portal</h1>
        </div>
        <div className={styles.hamburger} onClick={() => setDropdownVisible(!isDropdownVisible)}>
            ☰
        </div>
    </nav>

    {isDropdownVisible && (
        <div className={styles.dropdown}>
            <div className={styles.dropdownItem} onClick={() => navigate("/user-profile")}>
                User Profile
            </div>
            <div className={styles.dropdownItem} onClick={handleLogout}>
                Log Out
            </div>
        </div>
    )}
        
        <div className={styles['outer-container']}>
            <div className={styles['inner-container']}>
                <div className={styles['card']}>
                    <form className={styles['form-container']}>
                        <img
                            src={logoimage}
                            alt="20 Year Logo"
                            className={styles['logo-image']}
                        />
                        <h1>User Portal</h1>

                        {/* ✅ Show Confirming Access Message */}
                        {loadingAccess ? (
                            <p className={styles['loading-text']}>Confirming Access...</p>
                        ) : userAccess.length === 0 ? (
                            <p className={styles['error-text']}>
                                ❌ You do not have access to any portals. Please contact support.
                            </p>
                        ) : (
                            <>
                                {userAccess.includes("owner") && (
                                    <div className={styles['row']}>
                                        <button className={styles['portal-button']} type="button" onClick={handleOwnerPortalClick}>
                                            Owner Portal
                                        </button>
                                    </div>
                                )}
                                {userAccess.includes("trustee") && (
                                    <div className={styles['row']}>
                                        <button className={styles['portal-button']} type="button" onClick={handleTrusteePortalClick}>
                                            Trustee Portal
                                        </button>
                                    </div>
                                )}
                                {userAccess.includes("contractor") && (
                                    <div className={styles['row']}>
                                        <button className={styles['portal-button']} type="button" onClick={handleContractorPortalClick}>
                                            Contractor Portal
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* ✅ Log Out Button */}
                        <div className={styles['logout-text']} onClick={handleLogout}>
                            Log Out
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </div>
    );
};

export default UserPortalPage;
