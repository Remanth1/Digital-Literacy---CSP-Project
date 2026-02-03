import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const translations = {
  english: {
    selectLanguage: 'Select Your Language',
    currentLanguage: 'Current Language',
    goToLessons: 'Go to Lessons',
    viewProgress: 'View Progress'
  },
  hindi: {
    selectLanguage: 'अपनी भाषा चुनें',
    currentLanguage: 'वर्तमान भाषा',
    goToLessons: 'पाठों पर जाएं',
    viewProgress: 'प्रगति देखें'
  },
  telugu: {
    selectLanguage: 'మీ భాషను ఎంచుకోండి',
    currentLanguage: 'ప్రస్తుత భాష',
    goToLessons: 'పాఠాలకు వెళ్లండి',
    viewProgress: 'పురోగతిని చూడండి'
  }
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #333;
`;

const LanguageButton = styled.button`
  margin: 10px;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  transition: background 0.3s;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 2rem;
`;

const NavigationButton = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: #218838;
  }
`;

function LanguageSelect({ onSelect, currentLanguage }) {
  const navigate = useNavigate();
  const t = translations[currentLanguage] || translations.english;

  const handleLanguageSelect = (lang) => {
    onSelect(lang);
  };

  return (
    <Container>
      <Title>{t.selectLanguage}</Title>
      <ButtonContainer>
        <LanguageButton onClick={() => handleLanguageSelect('english')}>
          English
        </LanguageButton>
        <LanguageButton onClick={() => handleLanguageSelect('hindi')}>
          हिंदी
        </LanguageButton>
        <LanguageButton onClick={() => handleLanguageSelect('telugu')}>
          తెలుగు
        </LanguageButton>
      </ButtonContainer>
      
      {currentLanguage && (
        <div>
          <p>{t.currentLanguage}: {
            currentLanguage === 'english' ? 'English' :
            currentLanguage === 'hindi' ? 'हिंदी' : 'తెలుగు'
          }</p>
          <NavigationButton onClick={() => navigate('/lessons')}>
            {t.goToLessons}
          </NavigationButton>
          <NavigationButton onClick={() => navigate('/dashboard')}>
            {t.viewProgress}
          </NavigationButton>
        </div>
      )}
    </Container>
  );
}

export default LanguageSelect;