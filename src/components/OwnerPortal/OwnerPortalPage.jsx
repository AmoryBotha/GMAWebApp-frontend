import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OwnerPortalPage.module.css";
import logoimage from "../assets/20 year logo.png";
import { useLocation } from "react-router-dom";

const OwnerPortalPage = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [ownerAccounts, setOwnerAccounts] = useState([]);
    const [expandedOwnerId, setExpandedOwnerId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.title = "GMA Portal || Owner Portal";
        const fetchOwnerAccounts = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("🚨 No token found. Redirecting to login.");
                navigate("/");
                return;
            }
            

            console.log("📡 Fetching owner accounts...");
            try {
                const response = await fetch(
                    "https://gmawebapp-backend.onrender.com/api/owner-accounts-linked/",
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                console.log(`📡 Server response status: ${response.status}`);

                if (response.status === 401) {
                    console.warn("⚠️ Unauthorized request. Logging out...");
                    localStorage.removeItem("token");
                    navigate("/");
                    return;
                }

                const data = await response.json();
                console.log("📥 Received data:", data);

                if (response.ok) {
                    setOwnerAccounts(data);
                    console.log("✅ Owner accounts successfully set.");
                } else {
                    console.error(
                        "❌ Error fetching data:",
                        data.error || "Failed to fetch data"
                    );
                    setError(data.error || "Failed to fetch data");
                }
            } catch (err) {
                console.error("🚨 Network error:", err);
                setError("Something went wrong. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        // ✅ Fetch on initial mount and when `location.pathname` changes
        fetchOwnerAccounts();
    }, [navigate, location.pathname]);  // ✅ Reacts to route changes

    const toggleExpand = (ownerId) => {
        console.log(`🔍 Toggling expand for Owner Account ID: ${ownerId}`);
        console.log(`🔍 Previous Expanded ID: ${expandedOwnerId}`);

        setExpandedOwnerId((prevId) => {
            const newExpandedId = prevId === ownerId ? null : ownerId;
            console.log(`✅ New Expanded Owner ID: ${newExpandedId}`);

            setOwnerAccounts((prevAccounts) => [...prevAccounts]);

            return newExpandedId;
        });
    };

    const formatCurrency = (amount) => {
        return `R ${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <div>
            <nav className={`${styles.navbar} ${isDropdownVisible ? styles.navbarDropdownActive : ""}`}>
                <div className={styles.logo}>
                    <img src={logoimage} alt="20 Year Logo" className={styles["logoImage"]} />
                </div>
                <div className={styles.title}>
                    <h1>Owner Portal</h1>
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

            <div className={styles["outer-container"]}>
                <div className={styles["inner-container"]}>
                    {loading ? (
                        <div className={styles["loading-container"]}>
                            <div className={styles["spinner"]}></div>
                            <p className={styles["loading-text"]}>Loading...</p>
                        </div>
                    ) : error ? (
                        <p className={styles["no-accounts"]}>{error}</p>
                    ) : ownerAccounts.length === 0 ? (
                        <p className={styles["no-accounts"]}>No Owner Accounts Found.</p>
                    ) : (
                        ownerAccounts.map((owner) => (
                            <div key={owner.id} className={`${styles.expandableDiv} ${expandedOwnerId === owner.id ? styles.expanded : ""}`}>
                                <div className={styles.divHeader}>
                                    <div className={styles.section}>
                                        <span>Owner Account Name:</span>
                                        <span>{owner.owner_account_name}</span>
                                    </div>
                                    <div className={styles.section}>
                                        <span>Registration ID:</span>
                                        <span>{owner.registration_id}</span>
                                    </div>
                                    <div className={styles.section}>
                                        <span>Phone Number:</span>
                                        <span>{owner.phone_number}</span>
                                    </div>
                                    <div className={styles.section}>
                                        <span>Email:</span>
                                        <span>{owner.email}</span>
                                    </div>
                                    <div className={styles.actions}>
                                    <span className={styles.modify} onClick={() => navigate(`/account-detail-view/${owner.id}`)}>Modify</span> 
                                    <div className={styles.emptySpace}></div>
                                        <span className={styles.arrow} onClick={() => toggleExpand(owner.id)}>
                                            {expandedOwnerId === owner.id ? "↑" : "↓"}
                                        </span>
                                    </div>
                                </div>

                                {expandedOwnerId === owner.id && (
                                    <>
                                        <div className={styles.separator}></div>
                                        {(!owner.levy_accounts || owner.levy_accounts.length === 0) ? (
                                            <p>No Levy Accounts for this Owner.</p>
                                        ) : (
                                            <>
                                                <div className={styles["levy-header"]}>
                                                    <span>Levy</span>
                                                    <span>Complex</span>
                                                    <span>Number</span>
                                                    <span>Current</span>
                                                    <span>                 </span>
                                                    <span>                 </span>
                                                </div>
                                                {owner.levy_accounts.map((levy) => (
                                                    <div key={levy.id} className={styles["levy-row"]}>
                                                        <span>{levy.levy_name}</span>
                                                        <span>{levy.building}</span>
                                                        <span>{levy.door_number}</span>
                                                        <span>{formatCurrency(levy.current_balance)}</span>
                                                        <span className={styles['modify']} onClick={() => navigate(`/levy-account-detail/${levy.id}/${owner.id}`)}>View</span>
                                                        <span
                                                            className={styles['modify']}
                                                            onClick={() => navigate(`/download-statement/`, {
                                                            state: {
                                                            sageAccountNumber: levy.levy_name,
                                                            gmaAccountNumberID: levy.id,
                                                            userEmail: localStorage.getItem("userEmail"),
                                                            userProfileID: localStorage.getItem("userProfileId")
                                                            },
                                                            })}
                                                            >
                                                            Download Statement
                                                            </span>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OwnerPortalPage;
