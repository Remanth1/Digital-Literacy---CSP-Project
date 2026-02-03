import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const translations = {
  english: {
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    language: 'Language',
    needAccount: 'Need an account? Register',
    haveAccount: 'Have an account? Login',
    selectLanguage: 'Select Language',
    invalidCredentials: 'Invalid username or password',
    createAccount: 'User not found. Please create an account',
    userExists: 'Username already exists. Please choose another'
  },
  hindi: {
    login: 'लॉगिन',
    register: 'पंजीकरण',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    language: 'भाषा',
    needAccount: 'खाता चाहिए? पंजीकरण करें',
    haveAccount: 'खाता है? लॉगिन करें',
    selectLanguage: 'भाषा चुनें',
    invalidCredentials: 'गलत उपयोगकर्ता नाम या पासवर्ड',
    createAccount: 'उपयोगकर्ता नहीं मिला। कृपया खाता बनाएं',
    userExists: 'उपयोगकर्ता नाम पहले से मौजूद है। कृपया दूसरा चुनें'
  },
  telugu: {
    login: 'లాగిన్',
    register: 'నమోదు',
    username: 'వినియోగదారు పేరు',
    password: 'పాస్వర్డ్',
    language: 'భాష',
    needAccount: 'ఖాతా కావాలా? నమోదు చేయండి',
    haveAccount: 'ఖాతా ఉందా? లాగిన్ చేయండి',
    selectLanguage: 'భాష ఎంచుకోండి',
    invalidCredentials: 'తప్పుడు వినియోగదారు పేరు లేదా పాస్వర్డ్',
    createAccount: 'వినియోగదారు కనుగొనలేదు. దయచేసి ఖాతా సృష్టించండి',
    userExists: 'వినియోగదారు పేరు ఇమి ఉంది. దయచేసి మరొకటి ఎంచుకోండి'
  }
};

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginForm = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  border-top: 4px solid ${props => props.isRegister ? '#28a745' : '#667eea'};
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: ${props => props.isRegister ? '#28a745' : '#667eea'};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  
  &:before {
    content: '${props => props.isRegister ? '👤' : '🔐'}';
    font-size: 1.2em;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: ${props => props.isRegister ? '#28a745' : '#667eea'};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    background: ${props => props.isRegister ? '#218838' : '#5a6fd8'};
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 10px;
`;

const LanguageSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1.5rem;
`;

const LanguageButton = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? '#667eea' : '#ddd'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  
  &:hover {
    border-color: #667eea;
    background: ${props => props.active ? '#5a6fd8' : '#f0f2ff'};
  }
`;

const Error = styled.div`
  color: red;
  text-align: center;
  margin-top: 10px;
`;

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('english');
  const [formData, setFormData] = useState({ username: '', password: '', language: 'english' });
  const [error, setError] = useState('');
  
  const t = translations[currentLanguage];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      onLogin(response.data.user, response.data.token);
    } catch (error) {
      const errorMsg = error.response?.data?.error;
      if (errorMsg === 'Invalid credentials') {
        setError(t.invalidCredentials);
      } else if (errorMsg === 'User not found') {
        setError(t.createAccount);
      } else if (errorMsg?.includes('duplicate') || errorMsg?.includes('exists')) {
        setError(t.userExists);
      } else {
        setError(errorMsg || 'An error occurred');
      }
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit} isRegister={!isLogin}>
        <LanguageSelector>
          <LanguageButton 
            type="button"
            active={currentLanguage === 'english'}
            onClick={() => {
              setCurrentLanguage('english');
              setFormData({...formData, language: 'english'});
            }}
          >
            English
          </LanguageButton>
          <LanguageButton 
            type="button"
            active={currentLanguage === 'hindi'}
            onClick={() => {
              setCurrentLanguage('hindi');
              setFormData({...formData, language: 'hindi'});
            }}
          >
            हिंदी
          </LanguageButton>
          <LanguageButton 
            type="button"
            active={currentLanguage === 'telugu'}
            onClick={() => {
              setCurrentLanguage('telugu');
              setFormData({...formData, language: 'telugu'});
            }}
          >
            తెలుగు
          </LanguageButton>
        </LanguageSelector>
        <Title isRegister={!isLogin}>{isLogin ? t.login : t.register}</Title>
        <Input
          type="text"
          placeholder={t.username}
          value={formData.username}
          onChange={(e) => setFormData({...formData, username: e.target.value})}
          required
        />
        <Input
          type="password"
          placeholder={t.password}
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
        <Button type="submit" isRegister={!isLogin}>{isLogin ? t.login : t.register}</Button>
        <div style={{textAlign: 'center'}}>
          <ToggleButton type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? t.needAccount : t.haveAccount}
          </ToggleButton>
        </div>
        {error && <Error>{error}</Error>}
      </LoginForm>
    </LoginContainer>
  );
}

export default Login;