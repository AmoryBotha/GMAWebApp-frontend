import React from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Replace this:
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// With:
import { HashRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './components/AuthPage/AuthPage';
import UserPortalPage from './components/UserPortal/UserPortalPage';
import OwnerPortalPage from './components/OwnerPortal/OwnerPortalPage';
import ResetPasswordPage from './components/ResetPasswordPage/ResetPasswordPage';
import UserProfile from './components/UserProfile/UserProfile';
import TrusteePortalPage from './components/TrusteePortal/TrusteePortalPage';
import AccountDetailView from './components/AccountDetailPage/AccountDetailPage';
import LevyAccountDetailPage from './components/LevyAccountDetailPage/LevyAccountDetailPage';
import FRChangePage from './components/FRChangePage/FRChangePage';
import DownloadStatementPage from './components/DownloadStatementPage/DownloadStatementPage';

function App() {
    return (
        <HashRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/user-portal" element={<UserPortalPage />} />
        <Route path="/owner-portal" element={<OwnerPortalPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/trustee-portal" element={<TrusteePortalPage />} />
        <Route path="/account-detail-view/:accountId" element={<AccountDetailView />} />
        <Route path="/levy-account-detail/:levyAccountId/:responsiblePersonId" element={<LevyAccountDetailPage />} />
        <Route path="/fr-change" element={<FRChangePage />} />
        <Route path="/download-statement" element={<DownloadStatementPage />} />
      </Routes>
    </HashRouter>
    );
}

export default App;
