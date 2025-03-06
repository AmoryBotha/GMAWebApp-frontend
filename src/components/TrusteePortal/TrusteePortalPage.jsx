import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TrusteePortalPage.module.css";
import logoimage from "../assets/20 year logo.png";
import { useLocation } from "react-router-dom";

const TrusteePortalPage = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    //const [ownerAccounts, setOwnerAccounts] = useState([]);
    //const [expandedOwnerId, setExpandedOwnerId] = useState(null);
    //const [error, setError] = useState(null);
    //const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = "GMA Portal || Trustee Portal";
        const fetchOwnerAccounts = async () => {
            
        };

        // ✅ Fetch on initial mount and when `location.pathname` changes
        fetchOwnerAccounts();
    }, [navigate, location.pathname]);  // ✅ Reacts to route changes

   // const toggleExpand = (ownerId) => {

    //};

    //const formatCurrency = (amount) => {
    //};

    return (
        <div>
            <nav className={`${styles.navbar} ${isDropdownVisible ? styles.navbarDropdownActive : ""}`}>
                <div className={styles.logo}>
                    <img src={logoimage} alt="20 Year Logo" className={styles.logoImage} />
                </div>
                <div className={styles.title}>
                    <h1>Trustee Portal</h1>
                </div>
                <div className={styles.backButton} onClick={() => navigate(-1)}>
                     ← Back
                </div>
                <div className={styles.hamburger} onClick={() => setDropdownVisible(!isDropdownVisible)}>
                    ☰
                </div>
            </nav>

            {isDropdownVisible && (
                <div className={styles.dropdown}>
                    <div className={styles.dropdownItem} onClick={() => navigate("/user-portal")}>
                        User Portal
                    </div>
                    <div className={styles.dropdownItem} onClick={() => navigate("/user-profile")}>
                        User Profile
                    </div>
                    <div className={styles.dropdownItem} onClick={() => {
                        console.log("🚪 Logging out...");
                        localStorage.removeItem("token");
                        navigate("/");
                    }}>
                        Log Out
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrusteePortalPage;
