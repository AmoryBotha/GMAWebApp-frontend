import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./AccountDetailPage.module.css";
import logoimage from "../assets/20 year logo.png";

const AccountDetailView = () => {
    const { accountId } = useParams(); // Get account ID from URL
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Form fields
    const [accountName, setAccountName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [registrationId, setRegistrationId] = useState('');
    const [billingAddress1, setBillingAddress1] = useState('');
    const [billingAddress2, setBillingAddress2] = useState('');
    const [billingAddress3, setBillingAddress3] = useState('');

    useEffect(() => {
        document.title = "GMA Portal || Account Detail View";
        const fetchAccountDetail = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/account/${accountId}/`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (response.status === 404) {
                    setError("Account not found.");
                    return;
                }

                const data = await response.json();
                if (response.ok) {
                    setAccountName(data.name || '');
                    setEmail(data.emailaddress1 || '');
                    setMobileNumber(data.telephone1 || '');
                    setRegistrationId(data.cj_registrationidpassport || '');
                    setBillingAddress1(data.address1_line1 || '');
                    setBillingAddress2(data.address1_line2 || '');
                    setBillingAddress3(data.address1_line3 || '');
                } else {
                    setError(data.error || "Failed to fetch account details.");
                }
            } catch (err) {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetail();
    }, [accountId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        const updatedData = {
            name: accountName,
            emailaddress1: email,
            telephone1: mobileNumber,
            cj_registrationidpassport: registrationId,
            address1_line1: billingAddress1,
            address1_line2: billingAddress2,
            address1_line3: billingAddress3
        };

        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/account/update/${accountId}/`,
                {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedData)
                }
            );

            const data = await response.json();
                if (response.ok) {
                setSuccessMessage("✅ Account updated successfully!");
                setError(""); // Clear error message if success
                } else {
                setError(data.error || "❌ Failed to update account.");
                setSuccessMessage(""); // Clear success message if error
            }
        } catch (err) {
            setError("Something went wrong.");
        }
    };

    return (
        <div>
            <nav className={`${styles.navbar} ${isDropdownVisible ? styles.navbarDropdownActive : ""}`}>
                <div className={styles.logo}>
                    <img src={logoimage} alt="20 Year Logo" className={styles.logoImage} />
                </div>
                <div className={styles.title}>
                    <h1>Account Detail View</h1>
                </div>
                {/* Back Button */}
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
                    {loading ? (
                        <div className={styles["loading-container"]}>
                        <div className={styles["spinner"]}></div>
                        <p className={styles["loading-text"]}>Loading Account Details...</p>
                    </div>
                    ) : (
                        <div className={styles['card']}>
                            <form className={styles['form-container']} onSubmit={handleSubmit}>
                                <h1>Account Information</h1>
                                <p>You can edit the details of your account here. Changes will apply to all linked levy statements.</p>

                                {error && <p className={styles['error-text']}>{error}</p>}
                                {successMessage && <p className={styles['success-text']}>{successMessage}</p>}

                                <div className={styles['row']}>
                                <div className={styles['input-group']}>
                                <input type="text" placeholder="Account Name" value={accountName} readOnly />
                                </div>
                                <div className={styles['input-group']}>
                                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input type="text" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
                                    </div>
                                    <div className={styles['input-group']}>
                                        <input type="text" placeholder="ID/Reg Number" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} required />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input type="text" placeholder="Billing Address Line 1" value={billingAddress1} onChange={(e) => setBillingAddress1(e.target.value)} />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input type="text" placeholder="Billing Address Line 2" value={billingAddress2} onChange={(e) => setBillingAddress2(e.target.value)} />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input type="text" placeholder="Billing Address Line 3" value={billingAddress3} onChange={(e) => setBillingAddress3(e.target.value)} />
                                    </div>
                                </div>
                                <button type="submit">Update</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountDetailView;
