import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import styles from "./LevyAccountDetailPage.module.css";
import logoimage from "../assets/20 year logo.png";

const LevyAccountDetailPage = () => {
    const { levyAccountId, responsiblePersonId } = useParams();
    const navigate = useNavigate();
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [levyDetails, setLevyDetails] = useState(null);

    useEffect(() => {
        document.title = "GMA Portal || Levy Account Details View";
        const fetchLevyDetails = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/levy-account/${levyAccountId}/${responsiblePersonId}/`,
                    {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const data = await response.json();
                console.log("📥 API Response:", data);

                if (response.ok) {
                    setLevyDetails(data);
                } else {
                    setError(data.error || "Failed to fetch levy account details.");
                }
            } catch (err) {
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchLevyDetails();
    }, [levyAccountId, responsiblePersonId, navigate]);


    const handleChangeFriendlyLetter = () => {
        if (levyDetails) {
            navigate("/fr-change", {
                state: {
                    levyAccountNumber: levyDetails.cj_sageaccountnumber,
                    friendlyReminderActive: levyDetails.cj_sendfriendlyreminder,
                    levyAccountId: levyDetails.cj_gmaaccountnumberid
                }
            });
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
                        Levy Details {levyDetails?.cj_sageaccountnumber ? ` - ${levyDetails.cj_sageaccountnumber}` : ""}
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

            <div className={styles.contentWrapper}>
                {loading ? (
                    <div className={styles["loading-container"]}>
                        <div className={styles["spinner"]}></div>
                        <p className={styles["loading-text"]}>Loading Levy Account Details...</p>
                    </div>
                ) : error ? (
                    <p className={styles.errorText}>{error}</p>
                ) : levyDetails ? (
                    <div className={styles.cardContainer}>
                        {/* Age Details */}
                        <div className={styles['card']}>
                            <h1>Age Details</h1>
                            <h3>Balance</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="Balance" value={"R    " + levyDetails.cj_agetotal || "R   0.00"} readOnly />
                            </div>
                            <h3>Current</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="Current" value={"R    " + levyDetails.cj_agecurrent || "R   0.00"} readOnly />
                            </div>
                            <h3>30 Days</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="30 Days" value={"R    " + levyDetails.cj_age30days || "R   0.00"} readOnly />
                            </div>
                            <h3>60 Days</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="60 Days" value={"R    " + levyDetails.cj_age60days || "R   0.00"} readOnly />
                            </div>
                            <h3>90 Days</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="90 Days" value={"R    " + levyDetails.cj_age90days || "R   0.00"} readOnly />
                            </div>
                            <h3>120 Days</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="120 Days" value={"R    " + levyDetails.cj_age120days || "R   0.00"} readOnly />
                            </div>
                            <h3>150 Days</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="150 Days" value={"R    " + levyDetails.cj_age150days || "R   0.00"} readOnly />
                            </div>
                            <h3>180 Days</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="180 Days" value={"R    " + levyDetails.cj_age180days || "R   0.00"} readOnly />
                            </div>
                        </div>

                        {/* Statement Address */}
                        <div className={styles['card']}>
                            <h1>Statement Address</h1>
                            <h3>Owner</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="Owner" value={levyDetails.cj_responsablepartyfullname} readOnly />
                            </div>
                            <h3>Billing Address 1</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="Billing Address 1" value={levyDetails.cj_doornumber} readOnly />
                            </div>
                            <h3>Billing Address 2</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="Billing Address 2" value={levyDetails.cj_billingaddress1} readOnly />
                            </div>
                            <h3>Billing Address 3</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="Billing Address 3" value={levyDetails.cj_billingaddress2} readOnly />
                            </div>
                            <h3>Billing Address 4</h3>
                            <div className={styles['input-group']}>
                                <input type="text" placeholder="Billing Address 4" value={levyDetails.cj_billingaddress3} readOnly />
                            </div>
                            <p className={styles.infoText}>
                                To amend the billing details, go to the{" "}
                                <Link to="/owner-portal" className={styles.link}>Accounts Page</Link> and click on the Modify button.
                            </p>
                        </div>

                        {/* Information */}
                        <div className={styles['card']}>
                            <h1>Information</h1>
                            {[
                                { label: "Handed Over to Legal", key: "cj_legal" },
                                { label: "Active Arrangement", key: "cj_activeaod" },
                            ].map((item, index) => (
                                <React.Fragment key={index}>
                                    <h3>{item.label}</h3>
                                    <div className={styles['input-group']}>
                                        <input type="text" placeholder={item.label} value={levyDetails[item.key] ? "Yes" : "No"} readOnly />
                                    </div>
                                </React.Fragment>
                            ))}

                            {/* Friendly Letter Active */}
                            <h3>Friendly Letter Active</h3>
                            <div className={styles['input-group']}>
                                <input
                                    type="text"
                                    placeholder="Friendly Letter Active"
                                    value={levyDetails.cj_sendfriendlyreminder ? "Yes" : "No"}
                                    readOnly
                                />
                            </div>

                            {/* Buttons */}
                            <div className={styles.buttonContainer}>
                                <button className={styles.actionButton} onClick={handleChangeFriendlyLetter}>
                                    Change Friendly Letter
                                </button>
                                <button
                                        className={styles.actionButton}
                                        onClick={() => navigate("/download-statement", {
                                        state: {
                                        sageAccountNumber: levyDetails.cj_sageaccountnumber,
                                        gmaAccountNumberID: levyDetails.cj_gmaaccountnumberid,
                                        userEmail: localStorage.getItem("userEmail"),
                                        userProfileID: localStorage.getItem("userProfileId")
                                    },
                                    })}
                                >
                                    Download Statement
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className={styles.errorText}>No levy account details found.</p>
                )}
            </div>
        </div>
    );
};

export default LevyAccountDetailPage;
