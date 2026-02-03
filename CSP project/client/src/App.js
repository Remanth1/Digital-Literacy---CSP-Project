import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Login from './components/Login';
import Lessons from './components/Lessons';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import QA from './components/QA';
import Quiz from './components/Quiz';

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
  min-height: 100vh;
  background: #f5f5f5;
`;

function App() {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('english');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedLanguage = localStorage.getItem('selectedLanguage');
    
    if (token && savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setLanguage(userData.language || savedLanguage || 'english');
    } else if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    setLanguage(userData.language || 'english');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('selectedLanguage', userData.language || 'english');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    setLanguage(updatedUser.language);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('selectedLanguage', updatedUser.language);
  };

  return (
    <AppContainer>
      <Router>
        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/lessons" /> : <Login onLogin={handleLogin} />
          } />
          <Route path="/lessons" element={
            !user ? <Navigate to="/login" /> : 
            <Lessons language={language} user={user} onLogout={handleLogout} onLanguageChange={handleLanguageSelect} />
          } />
          <Route path="/dashboard" element={
            !user ? <Navigate to="/login" /> : 
            <Dashboard language={language} user={user} onLogout={handleLogout} onLanguageChange={handleLanguageSelect} />
          } />
          <Route path="/profile" element={
            !user ? <Navigate to="/login" /> : 
            <Profile user={user} language={language} onLogout={handleLogout} onUserUpdate={handleUserUpdate} />
          } />
          <Route path="/qa" element={
            !user ? <Navigate to="/login" /> : 
            <QA language={language} />
          } />
          <Route path="/quiz" element={
            !user ? <Navigate to="/login" /> : 
            <Quiz language={language} user={user} />
          } />
          <Route path="/" element={<Navigate to={user ? "/lessons" : "/login"} />} />
        </Routes>
      </Router>
    </AppContainer>
  );
}

export default App;