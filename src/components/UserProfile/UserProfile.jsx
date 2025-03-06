import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UserProfile.module.css";
import logoimage from "../assets/20 year logo.png";

const UserProfile = () => {
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [loading, setLoading] = useState(true); // ✅ Loading state
    const [email, setEmail] = useState('');
    //const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    //const [idNumber, setIdNumber] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "GMA Portal || User Profile";
        const fetchUserProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("🚨 No token found. Redirecting to login.");
                navigate("/");
                return;
            }

            try {
                // ✅ Decode JWT to extract email
                const decodedToken = JSON.parse(atob(token.split(".")[1]));
                const userEmail = decodedToken.email || null;

                if (!userEmail) {
                    console.error("❌ Email is missing in token!");
                    return;
                }

                console.log("📡 Fetching User Profile...");

                // ✅ Get `cj_userprofileid`
                const profileResponse = await fetch(`http://127.0.0.1:8000/api/user-profile/email/${encodeURIComponent(userEmail)}/`, {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    }
                });

                const profileData = await profileResponse.json();

                if (profileResponse.ok) {
                    console.log("✅ User Profile Data:", profileData);

                    // ✅ Populate form fields
                    setEmail(profileData.cj_email || '');
                    setFirstName(profileData.cj_name || '');
                    setLastName(profileData.cj_lastname || '');
                    setMobileNumber(profileData.cj_cellnumber || '');

                    // ✅ Store `userProfileId` for later update
                    localStorage.setItem("userProfileId", profileData.cj_userprofileid);
                } else {
                    console.error("❌ Failed to fetch user profile:", profileData.error);
                }
            } catch (err) {
                console.error("🚨 Network error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const userProfileId = localStorage.getItem("userProfileId");

        if (!userProfileId) {
            console.error("❌ User profile ID not found.");
            return;
        }

        try {
            console.log("📤 Sending update request...");

            const updateResponse = await fetch(`http://127.0.0.1:8000/api/user-profile/update/${userProfileId}/`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    cj_email: email,
                    cj_name: firstName,
                    cj_lastname: lastName,
                    cj_cellnumber: mobileNumber
                })
            });

            const updateData = await updateResponse.json();

            if (updateResponse.ok) {
                console.log("✅ Update Successful:", updateData);
                setSuccessMessage("User profile updated successfully!");
            } else {
                setError(updateData.error || "Failed to update profile.");
            }
        } catch (err) {
            console.error("🚨 Server error:", err);
            setError("Failed to connect to the server.");
        }
    };

    return (
        <div>
            <nav className={`${styles.navbar} ${isDropdownVisible ? styles.navbarDropdownActive : ""}`}>
                <div className={styles.logo}>
                    <img src={logoimage} alt="20 Year Logo" className={styles.logoImage} />
                </div>
                <div className={styles.title}>
                    <h1>User Profile</h1>
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
                    <div className={styles.dropdownItem} onClick={() => {
                        console.log("🚪 Logging out...");
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
                        <p className={styles["loading-text"]}>Loading User Profile...</p>
                    </div>
                    ) : (
                        <div className={styles['card']}>
                            <form className={styles['form-container']} onSubmit={handleSubmit}>
                                <img src={logoimage} alt="20 Year Logo" className={styles['logo-image']} />
                                <h1>User Profile Information</h1>

                                {error && <p className={styles['error-text']}>{error}</p>}
                                {successMessage && <p className={styles['success-text']}>{successMessage}</p>}

                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                    </div>
                                    <div className={styles['input-group']}>
                                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input type="text" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required />
                                    </div>
                                </div>
                                <div className={styles['row']}>
                                    <div className={styles['input-group']}>
                                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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

export default UserProfile;
