import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./DownloadStatementPage.module.css";
import logoimage from "../assets/20 year logo.png";

const DownloadStatementPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    // Retrieve details from navigation state or fallback to localStorage
    const {
        sageAccountNumber,
        gmaAccountNumberID,
        userEmail,
        userProfileID
    } = location.state || {
        sageAccountNumber: localStorage.getItem("sageAccountNumber"),
        gmaAccountNumberID: localStorage.getItem("gmaAccountNumberId"),
        userEmail: localStorage.getItem("userEmail"),
        userProfileID: localStorage.getItem("userProfileId")
    };

    useEffect(() => {
        document.title = "GMA Portal || Download Statement";
        if (!gmaAccountNumberID || !userProfileID || !userEmail) {
            setError("Missing required account details. Please go back and try again." + sageAccountNumber +" " + gmaAccountNumberID + " " + userEmail + " " + userProfileID);
            setLoading(false);  // ✅ Ensure loading stops
            return;
        }

        setLoading(false);
    }, [gmaAccountNumberID, userProfileID, userEmail, sageAccountNumber]);

    const handleDownload = async (type, event) => {
        event.preventDefault();

        if (!fromDate || !toDate) {
            setError("Please select a valid date range.");
            return;
        }

        if (new Date(fromDate) > new Date(toDate)) {
            setError("Invalid date range. 'From Date' must be before 'To Date'.");
            return;
        }

        setError("");
        setSuccessMessage("Processing your request...");

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const apiUrl = type === "pdf"
            ? "http://127.0.0.1:8000/api/statement/download/pdf/"
            : "http://127.0.0.1:8000/api/statement/download/excel/";

        const requestBody = {
            email: userEmail,
            gmaAccountNumberID : gmaAccountNumberID,
            from: fromDate,
            to: toDate,
            userProfileID: userProfileID
        };

        try {
            console.log(`📤 Sending request to download ${type.toUpperCase()} statement...`);
            console.log(`📦 Payload:`, requestBody);

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(`Your ${type.toUpperCase()} statement is being processed. You will receive an email on ${userEmail} shortly.`);
            } else {
                setError(data.error || `Failed to download ${type.toUpperCase()} statement.`);
            }
        } catch (err) {
            console.error(`❌ Error requesting ${type.toUpperCase()} statement:`, err);
            setError(`Error requesting ${type.toUpperCase()} statement. Please try again.`);
        }
    };

    return (
        <div>
            {/* Navbar */}
            <nav className={`${styles.navbar} ${isDropdownVisible ? styles.navbarDropdownActive : ""}`}>
                <div className={styles.logo}>
                    <img src={logoimage} alt="20 Year Logo" className={styles.logoImage} />
                </div>
                <div className={styles.title}>
                    <h1>Statement Download {sageAccountNumber ? `- ${sageAccountNumber}` : ""}</h1>
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

            {/* Page Content */}
            <div className={styles['outer-container']}>
                <div className={styles['inner-container']}>
                    {loading ? (
                        <div className={styles["loading-container"]}>
                            <div className={styles["spinner"]}></div>
                            <p className={styles["loading-text"]}>Loading Statement Details...</p>
                        </div>
                    ) : (
                        <div className={styles['card']}>
                            <form className={styles['form-container']}>
                                <h2>Select Date Range</h2>
                                <p>Choose the date range for the statement you wish to download.</p>

                                {error && <p className={styles['error-text']}>{error}</p>}
                                {successMessage && <p className={styles['success-text']}>{successMessage}</p>}

                                {/* Date Pickers */}
                                <div className={styles.datePickerContainer}>
                                    <div className={styles['input-group']}>
                                        <label>From Date:</label>
                                        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                                    </div>
                                    <div className={styles['input-group']}>
                                        <label>To Date:</label>
                                        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                                    </div>
                                </div>

                                {/* Download Buttons */}
                                <div className={styles.buttonContainer}>
                                    <button className={styles.downloadButton} onClick={(e) => handleDownload("pdf", e)}>
                                        Download as PDF
                                    </button>
                                    <button className={styles.downloadButton} onClick={(e) => handleDownload("excel", e)}>
                                        Download as Excel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DownloadStatementPage;
