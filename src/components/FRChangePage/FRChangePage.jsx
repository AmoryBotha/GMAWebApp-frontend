import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./FRChangePage.module.css";
import logoimage from "../assets/20 year logo.png";

const FRChangePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { levyAccountNumber, friendlyReminderActive, levyAccountId } = location.state || {};

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [friendlyReminder, setFriendlyReminder] = useState(friendlyReminderActive);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        document.title = "GMA Portal || Friendly Letter Change";  // Change this to what you want
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");
    
        const token = localStorage.getItem("token"); // Ensure token is stored correctly
        if (!token) {
            setError("Authentication failed. Please log in again.");
            navigate("/");
            return;
        }
    
        try {
            const response = await fetch(
                `https://gmawebapp-backend.onrender.com/api/update-friendly-reminder/${levyAccountId}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,  // ✅ Ensure this header is included
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "cj_sendfriendlyreminder": friendlyReminder,
                    }),
                }
            );
    
            if (response.status === 401) {
                setError("Unauthorized request. Please log in again.");
                localStorage.removeItem("token"); // Clear invalid token
                navigate("/"); // Redirect to login page
            } else if (response.ok) {
                setSuccessMessage("✅ Friendly Letter updated successfully!");
                setError(""); // Clear error message if success
                } else {
                setError("❌ Failed to update Friendly Letter Override.");
                setSuccessMessage(""); // Clear success message if error
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <nav className={`${styles.navbar} ${isDropdownVisible ? styles.navbarDropdownActive : ""}`}>
                <div className={styles.logo}>
                    <img src={logoimage} alt="20 Year Logo" className={styles.logoImage} />
                </div>
                <div className={styles.title}>
                    <h1>
                        Change Friendly Letter {{levyAccountNumber} ? ` - ${levyAccountNumber}` : ""}
                    </h1>
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
                    <div className={styles.dropdownItem} onClick={() => navigate("/user-profile")}>
                        User Profile
                    </div>
                    <div className={styles.dropdownItem} onClick={() => navigate("/user-portal")}>
                        User Portal
                    </div>
                    <div className={styles.dropdownItem} onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }}>
                        Log Out
                    </div>
                </div>
            )}

        <div className={styles['outer-container']}>
        <div className={styles['inner-container']}>
            <div className={styles['card']}>
                <div className={styles['form-container']}>
                    <h2>You have selected to change your Friendly Reminder setting</h2>
                    <p>Friendly Reminders are sent out monthly, around the 8th, at no cost. They serve to notify you of any Levy accounts that may be outstanding at the time of dispatch, offering a chance to resolve the issue prior to the commencement of Credit Control procedures.

If the setting on the website is marked as 'Yes', it indicates that it is enabled, and our system will send a friendly reminder to you for the selected account when necessary.</p>
                    <h3>Current Settings</h3>
                    <div className={styles.inputGroup}>
                        <label>Levy Account Number</label>
                        <input type="text" value={levyAccountNumber} readOnly />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Friendly Reminder Active</label>
                        <select value={friendlyReminder} onChange={(e) => setFriendlyReminder(e.target.value === "true")}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    {error && <p className={styles.errorText}>{error}</p>}
                    {successMessage && <p className={styles.successText}>{successMessage}</p>}
                    <button className={styles.actionButton} onClick={handleSubmit} disabled={loading}>
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
        </div>
        </div>
    );
};

export default FRChangePage;
