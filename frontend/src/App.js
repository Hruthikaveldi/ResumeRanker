import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import ResumeDetail from './pages/ResumeDetail';
import Compare from './pages/Compare';
import Templates from './pages/Templates';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import JobPredictor from './pages/JobPredictor';
import SkillRoadmap from './pages/SkillRoadmap';
import MockInterview from './pages/MockInterview';
import ATSChecker from './pages/ATSChecker';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  return user ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"            element={<Navigate to="/login" />} />
            <Route path="/login"       element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register"    element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/analyze"     element={<PrivateRoute><Analyze /></PrivateRoute>} />
            <Route path="/resume/:id"  element={<PrivateRoute><ResumeDetail /></PrivateRoute>} />
            <Route path="/compare"     element={<PrivateRoute><Compare /></PrivateRoute>} />
            <Route path="/templates"   element={<PrivateRoute><Templates /></PrivateRoute>} />
            <Route path="/analytics"   element={<PrivateRoute><Analytics /></PrivateRoute>} />
            <Route path="/profile"     element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/predictor"   element={<PrivateRoute><JobPredictor /></PrivateRoute>} />
            <Route path="/roadmap"     element={<PrivateRoute><SkillRoadmap /></PrivateRoute>} />
            <Route path="/interview"   element={<PrivateRoute><MockInterview /></PrivateRoute>} />
            <Route path="/ats"         element={<PrivateRoute><ATSChecker /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}