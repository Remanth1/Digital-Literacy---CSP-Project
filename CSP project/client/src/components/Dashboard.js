import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: #333;
`;

const WelcomeMessage = styled.div`
  color: #667eea;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  margin: 20px 0;
`;

const NavButton = styled.button`
  padding: 10px 20px;
  margin: 0 5px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #218838;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #c82333;
  }
`;

const LanguageSelect = styled.select`
  padding: 10px 15px;
  margin: 0 5px;
  border: 2px solid #667eea;
  border-radius: 5px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #5a6fd8;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 1rem;
`;

const ProgressSection = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const ProgressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
`;

const ProgressItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  border-left: 4px solid ${props => props.completed ? '#28a745' : '#ffc107'};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  margin: 20px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const ContinueButton = styled.button`
  padding: 15px 30px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  margin: 20px auto;
  display: block;
  
  &:hover {
    background: #0056b3;
  }
`;

function Dashboard({ language, user, onLogout, onLanguageChange }) {
  const [progress, setProgress] = useState({ computer: [], mobile: [] });
  
  const translations = {
    english: {
      continueText: '100% progress is not completed. Complete it by clicking on it',
      dashboard: 'Learning Progress Dashboard',
      backToLessons: 'Back to Lessons',
      logout: 'Logout',
      overallProgress: 'Overall Progress',
      computerLessons: 'Computer Lessons',
      mobileLessons: 'Mobile Lessons',
      totalCompleted: 'Total Completed',
      computerProgress: 'Computer Lessons Progress',
      mobileProgress: 'Mobile Lessons Progress',
      complete: 'Complete',
      pending: 'Pending',
      welcome: 'Welcome'
    },
    hindi: {
      continueText: '100% प्रगति पूरी नहीं हुई है। इसे क्लिक करके पूरा करें',
      dashboard: 'सीखने की प्रगति डैशबोर्ड',
      backToLessons: 'पाठों पर वापस जाएं',
      logout: 'लॉगआउट',
      overallProgress: 'कुल प्रगति',
      computerLessons: 'कंप्यूटर पाठ',
      mobileLessons: 'मोबाइल पाठ',
      totalCompleted: 'कुल पूरा किया गया',
      computerProgress: 'कंप्यूटर पाठ प्रगति',
      mobileProgress: 'मोबाइल पाठ प्रगति',
      complete: 'पूरा',
      pending: 'लंबित',
      welcome: 'स्वागत है'
    },
    telugu: {
      continueText: '100% పురోగతి పూర్తి కాలేదు. దీన్ని క్లిక్ చేసి పూర్తి చేయండి',
      dashboard: 'నేర్చుకోవడం పురోగతి డ్యాష్బోర్డ్',
      backToLessons: 'పాఠాలకు తిరిగి వెళ్ళండి',
      logout: 'లాగ్ఆఉట్',
      overallProgress: 'మొత్తం పురోగతి',
      computerLessons: 'కంప్యూటర్ పాఠాలు',
      mobileLessons: 'మొబైల్ పాఠాలు',
      totalCompleted: 'మొత్తం పూర్తి చేసినవి',
      computerProgress: 'కంప్యూటర్ పాఠాల పురోగతి',
      mobileProgress: 'మొబైల్ పాఠాల పురోగతి',
      complete: 'పూర్తి',
      pending: 'పెండింగ్',
      welcome: 'స్వాగతం'
    }
  };
  const [lessons] = useState([
    { key: 'computer1', type: 'computer', titles: { english: 'Turning on/off a computer', hindi: 'कंप्यूटर चालू/बंद करना', telugu: 'కంప్యూటర్ ఆన్/ఆఫ్ చేయడం' }},
    { key: 'computer2', type: 'computer', titles: { english: 'Using a mouse and keyboard', hindi: 'माउस और कीबोर्ड का उपयोग', telugu: 'మౌస్ మరియు కీబోర్డ్ వాడకం' }},
    { key: 'computer3', type: 'computer', titles: { english: 'Understanding the desktop environment', hindi: 'डेस्कटॉप वातावरण को समझना', telugu: 'డెస్క్టాప్ వాతావరణాన్ని అర్థం చేసుకోవడం' }},
    { key: 'computer4', type: 'computer', titles: { english: 'Basic file management', hindi: 'मूल फ़ाइल प्रबंधन', telugu: 'ప్రాథమిక ఫైల్ నిర్వహణ' }},
    { key: 'computer5', type: 'computer', titles: { english: 'Internet and web browsing', hindi: 'इंटरनेट और वेब ब्राउज़िंग', telugu: 'ఇంటర్నెట్ మరియు వెబ్ బ్రౌజింగ్' }},
    { key: 'computer6', type: 'computer', titles: { english: 'Online safety and privacy', hindi: 'ऑनलाइन सुरक्षा और गोपनीयता', telugu: 'ఆన్లైన్ భద్రత మరియు గోప్యత' }},
    { key: 'mobile1', type: 'mobile', titles: { english: 'Turning On/off a Mobile', hindi: 'मोबाइल चालू/बंद करना', telugu: 'మొబైల్ ఆన్/ఆఫ్ చేయడం' }},
    { key: 'mobile2', type: 'mobile', titles: { english: 'Making and receiving calls', hindi: 'कॉल करना और प्राप्त करना', telugu: 'కాల్ చేయడం మరియు స్వీకరించడం' }},
    { key: 'mobile3', type: 'mobile', titles: { english: 'Sending and receiving messages', hindi: 'संदेश भेजना और प्राप्त करना', telugu: 'సందేశాలు పంపడం మరియు స్వీకరించడం' }},
    { key: 'mobile4', type: 'mobile', titles: { english: 'Using basic apps', hindi: 'मूल ऐप्स का उपयोग', telugu: 'ప్రాథమిక యాప్స్ వాడకం' }},
    { key: 'mobile5', type: 'mobile', titles: { english: 'Connecting to Wi-Fi', hindi: 'वाई-फाई से कनेक्ट करना', telugu: 'వై-ఫైకి కనెక్ట్ అవ్వడం' }},
    { key: 'mobile6', type: 'mobile', titles: { english: 'Using communication tools', hindi: 'संचार उपकरणों का उपयोग', telugu: 'కమ్యూనికేషన్ టూల్స్ వాడకం' }}
  ]);
  
  const navigate = useNavigate();

  const getDisplayName = (username) => {
    if (!username) return '';
    const namePart = username.split('@')[0];
    return namePart.replace(/[0-9]/g, '').replace(/[._-]/g, ' ').trim();
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const getCompletedCount = (type) => {
    return progress[type]?.filter(p => p.completed).length || 0;
  };

  const getTotalLessons = (type) => {
    return lessons.filter(l => l.type === type).length;
  };

  const getOverallProgress = () => {
    const totalCompleted = getCompletedCount('computer') + getCompletedCount('mobile');
    const totalLessons = getTotalLessons('computer') + getTotalLessons('mobile');
    return totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;
  };

  const renderProgressItems = (type) => {
    const typeLessons = lessons.filter(l => l.type === type);
    return typeLessons.map(lesson => {
      const isCompleted = progress[type]?.some(p => p.lessonId === lesson.key && p.completed) || false;
      return (
        <ProgressItem key={lesson.key} completed={isCompleted}>
          <span>{lesson.titles[language]}</span>
          <span style={{ color: isCompleted ? '#28a745' : '#ffc107', fontWeight: 'bold' }}>
            {isCompleted ? `✓ ${translations[language]?.complete || translations.english.complete}` : `○ ${translations[language]?.pending || translations.english.pending}`}
          </span>
        </ProgressItem>
      );
    });
  };

  return (
    <Container>
      <Header>
        <Title>{translations[language]?.dashboard || translations.english.dashboard}</Title>
        <div>
          <LanguageSelect 
            value={language} 
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="english">English</option>
            <option value="hindi">हिंदी</option>
            <option value="telugu">తెలుగు</option>
          </LanguageSelect>
          <NavButton onClick={() => navigate('/lessons')}>{translations[language]?.backToLessons || translations.english.backToLessons}</NavButton>
          <LogoutButton onClick={onLogout}>{translations[language]?.logout || translations.english.logout}</LogoutButton>
        </div>
      </Header>

      <WelcomeMessage>{translations[language].welcome}, {getDisplayName(user?.username)}!</WelcomeMessage>

      <StatsContainer>
        <StatCard>
          <StatNumber>{getOverallProgress()}%</StatNumber>
          <StatLabel>{translations[language]?.overallProgress || translations.english.overallProgress}</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{getCompletedCount('computer')}/{getTotalLessons('computer')}</StatNumber>
          <StatLabel>{translations[language]?.computerLessons || translations.english.computerLessons}</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{getCompletedCount('mobile')}/{getTotalLessons('mobile')}</StatNumber>
          <StatLabel>{translations[language]?.mobileLessons || translations.english.mobileLessons}</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{getCompletedCount('computer') + getCompletedCount('mobile')}</StatNumber>
          <StatLabel>{translations[language]?.totalCompleted || translations.english.totalCompleted}</StatLabel>
        </StatCard>
      </StatsContainer>

      <ProgressBar>
        <ProgressFill percentage={getOverallProgress()} />
      </ProgressBar>
      
      {getOverallProgress() < 100 && (
        <ContinueButton onClick={() => navigate('/lessons')}>
          {translations[language]?.continueText || translations.english.continueText}
        </ContinueButton>
      )}

      <ProgressSection>
        <SectionTitle>{translations[language]?.computerProgress || translations.english.computerProgress}</SectionTitle>
        <ProgressGrid>
          {renderProgressItems('computer')}
        </ProgressGrid>
      </ProgressSection>

      <ProgressSection>
        <SectionTitle>{translations[language]?.mobileProgress || translations.english.mobileProgress}</SectionTitle>
        <ProgressGrid>
          {renderProgressItems('mobile')}
        </ProgressGrid>
      </ProgressSection>
    </Container>
  );
}

export default Dashboard;