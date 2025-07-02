import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LandingPage from './components/LandingPage.tsx'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext.tsx'

const Root = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/landing-page';

  return (
    <Routes>
      <Route path="/landing-page" element={<LandingPage />} />
      <Route path="*" element={isLandingPage ? null : <App />} />
    </Routes>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <AuthProvider>
          <Root />
        </AuthProvider>
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
