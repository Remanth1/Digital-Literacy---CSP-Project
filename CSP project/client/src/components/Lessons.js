import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  text-align: center;
  margin-top: 30px;
  padding: 0 20px;
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
  background: ${props => props.disabled ? '#ccc' : '#28a745'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background: ${props => props.disabled ? '#ccc' : '#218838'};
  }
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 120%;
  left: ${props => props.alignLeft ? 'auto' : '50%'};
  right: ${props => props.alignLeft ? '0' : 'auto'};
  transform: ${props => props.alignLeft ? 'none' : 'translateX(-50%)'};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1000;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: ${props => props.alignLeft ? '80%' : '50%'};
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-bottom-color: #667eea;
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

const UserDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const UserIcon = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  
  &:hover {
    background: #5a6fd8;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 150px;
  z-index: 1000;
  margin-top: 5px;
  display: ${props => props.show ? 'block' : 'none'};
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:first-child {
    border-radius: 5px 5px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 5px 5px;
    color: #dc3545;
  }
`;

const SectionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  align-items: flex-start;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const Section = styled.div`
  width: 680px;
  max-width: 48%;
  margin: 0 1%;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const Select = styled.select`
  font-size: 1.1em;
  padding: 8px 12px;
  width: 100%;
  margin-bottom: 20px;
  max-width: 640px;
`;

const LessonContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 20px;
  background: white;
  width: 680px;
  max-width: 100%;
  margin: 0 auto;
`;

const LessonTitle = styled.div`
  font-weight: bold;
  margin-bottom: 15px;
  font-size: 1.4em;
  color: #333;
  text-align: center;
`;

const VideoFrame = styled.iframe`
  width: 640px;
  height: 315px;
  max-width: 100%;
  margin-top: 10px;
  border: none;
  border-radius: 8px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const ProgressButton = styled.button`
  margin-top: 10px;
  margin-right: 10px;
  padding: 8px 16px;
  background: ${props => props.completed ? '#28a745' : '#007bff'};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.completed ? '#218838' : '#0056b3'};
  }
`;

const ArrowButton = styled.button`
  margin-top: 10px;
  margin: 10px 5px 0 5px;
  padding: 8px 12px;
  background: #ffc107;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    background: #e0a800;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

function Lessons({ language, user, onLogout, onLanguageChange }) {
  const [lessons, setLessons] = useState([]);
  const [selectedComputer, setSelectedComputer] = useState(0);
  const [selectedMobile, setSelectedMobile] = useState(0);
  const [progress, setProgress] = useState({ computer: [], mobile: [] });
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showUserTooltip, setShowUserTooltip] = useState(false);
  const [showQuizTooltip, setShowQuizTooltip] = useState(false);
  const previousProgressRef = useRef(0);

  const navigate = useNavigate();

  const getDisplayName = (username) => {
    if (!username) return '';
    const namePart = username.split('@')[0];
    return namePart.replace(/[0-9]/g, '').replace(/[._-]/g, ' ').trim();
  };

  const langMap = {
    english: 'English',
    hindi: 'हिंदी',
    telugu: 'తెలుగు'
  };

  const translations = {
    english: {
      markComplete: 'Mark as Complete',
      markIncomplete: 'Mark as Incomplete',
      nextLesson: 'Next Lesson',
      viewProgress: 'View Progress',
      profile: 'Profile',
      logout: 'Logout',
      qa: 'Q&A',
      qaTooltip: 'Questions and their Clarification',
      quiz: 'Quiz',
      completeProgress: "It's locked, you should complete 100% to access the quiz",
      userTooltip: 'Profile and Logout',
      quizUnlocked: 'Congratulations! You have completed 100% progress. You are ready for the Quiz!',
      welcome: 'Welcome'
    },
    hindi: {
      markComplete: 'पूर्ण के रूप में चिह्नित करें',
      markIncomplete: 'अपूर्ण के रूप में चिह्नित करें',
      nextLesson: 'अगला पाठ',
      viewProgress: 'प्रगति देखें',
      profile: 'प्रोफाइल',
      logout: 'लॉगआउट',
      qa: 'प्रश्न उत्तर',
      qaTooltip: 'प्रश्न और उनका स्पष्टीकरण',
      quiz: 'क्विज़',
      completeProgress: 'यह लॉक है, क्विज़ तक पहुंचने के लिए आपको 100% पूरा करना चाहिए',
      userTooltip: 'प्रोफाइल और लॉगआउट',
      quizUnlocked: 'बधाई हो! आपने 100% प्रगति पूरी कर ली है। आप क्विज़ के लिए तैयार हैं!',
      welcome: 'स्वागत है'
    },
    telugu: {
      markComplete: 'పూర్తిగా గుర్తించండి',
      markIncomplete: 'అసంపూర్ణంగా గుర్తించండి',
      nextLesson: 'తరువాత పాఠం',
      viewProgress: 'పురోగతిని చూడండి',
      profile: 'ప్రొఫైల్',
      logout: 'లాగ్ఆఉట్',
      qa: 'ప్రశ్న సమాధానం',
      qaTooltip: 'ప్రశ్నలు మరియు వారి స్పష్టీకరణ',
      quiz: 'క్విజ్',
      completeProgress: 'ఇది లాక్ అయింది, క్విజ్ని ప్రవేశించడానికి మీరు 100% పూర్తి చేయాలి',
      userTooltip: 'ప్రొఫైల్ మరియు లాగ్ఆఉట్',
      quizUnlocked: 'అభినందనలు! మీరు 100% పురోగతి పూర్తి చేశారు. మీరు క్విజ్ కోసం సిద్ధంగా ఉన్నారు!',
      welcome: 'స్వాగతం'
    }
  };

  const fetchLessons = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/lessons?language=${language}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  }, [language]);

  const fetchProgress = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  }, []);

  useEffect(() => {
    fetchLessons();
    fetchProgress();
  }, [fetchLessons, fetchProgress]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserDropdown && !event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserDropdown]);

  const updateProgress = async (lessonKey, type, completed) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/progress', {
        lessonId: lessonKey,
        type,
        completed,
        watchTime: completed ? 100 : 50
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchProgress();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const checkCertificateStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const userData = await response.json();
          const currentProgress = calculateProgressPercentage();
          if (previousProgressRef.current < 100 && currentProgress === 100 && !userData.certificate?.earned) {
            alert(translations[language].quizUnlocked);
          }
          previousProgressRef.current = currentProgress;
        }
      } catch (error) {
        console.error('Error checking certificate status:', error);
      }
    };
    checkCertificateStatus();
  }, [progress, lessons, translations, language]);

  const goToNextLesson = (type, currentIndex) => {
    const lessons = type === 'computer' ? computerLessons : mobileLessons;
    const setSelected = type === 'computer' ? setSelectedComputer : setSelectedMobile;
    
    if (currentIndex < lessons.length - 1) {
      // Mark current lesson as complete
      updateProgress(lessons[currentIndex].key, type, true);
      // Move to next lesson
      setSelected(currentIndex + 1);
    }
  };

  const goToPreviousLesson = (type, currentIndex) => {
    const setSelected = type === 'computer' ? setSelectedComputer : setSelectedMobile;
    
    if (currentIndex > 0) {
      setSelected(currentIndex - 1);
    }
  };

  const handleVideoEnd = (lessonKey, type, currentIndex) => {
    // Auto-mark as complete and move to next lesson
    updateProgress(lessonKey, type, true);
    setTimeout(() => goToNextLesson(type, currentIndex), 1000);
  };

  const computerLessons = lessons.filter(l => l.type === 'computer');
  const mobileLessons = lessons.filter(l => l.type === 'mobile');

  const isCompleted = (lessonKey, type) => {
    return progress[type]?.some(p => p.lessonId === lessonKey && p.completed) || false;
  };

  const calculateProgressPercentage = () => {
    const totalLessons = lessons.length;
    if (totalLessons === 0) return 0;
    
    const completedLessons = lessons.filter(lesson => 
      isCompleted(lesson.key, lesson.type)
    ).length;
    
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const handleQuizClick = () => {
    const progressPercentage = calculateProgressPercentage();
    if (progressPercentage === 100) {
      navigate('/quiz');
    } else {
      alert(translations[language].completeProgress);
    }
  };

  const renderSection = (sectionLessons, selectedIndex, setSelected, type) => {
    if (sectionLessons.length === 0) return null;
    
    const currentLesson = sectionLessons[selectedIndex];
    const completed = isCompleted(currentLesson?.key, type);

    return (
      <Section>
        <SectionTitle>{type.charAt(0).toUpperCase() + type.slice(1)} Lessons</SectionTitle>
        <Select 
          value={selectedIndex} 
          onChange={(e) => setSelected(parseInt(e.target.value))}
        >
          {sectionLessons.map((lesson, index) => (
            <option key={lesson.key} value={index}>
              {lesson.titles[language]}
            </option>
          ))}
        </Select>
        
        <LessonContainer>
          <LessonTitle>{currentLesson?.titles[language]}</LessonTitle>
          {currentLesson?.videoId ? (
            <>
              <VideoFrame
                src={`https://drive.google.com/file/d/${currentLesson.videoId}/preview`}
                allowFullScreen
                onEnded={() => handleVideoEnd(currentLesson.key, type, selectedIndex)}
              />
              <div>
                <ArrowButton
                  onClick={() => goToPreviousLesson(type, selectedIndex)}
                  disabled={selectedIndex <= 0}
                >
                  ←
                </ArrowButton>
                <ProgressButton
                  completed={completed}
                  onClick={() => updateProgress(currentLesson.key, type, !completed)}
                >
                  {completed ? translations[language].markIncomplete : translations[language].markComplete}
                </ProgressButton>
                <ArrowButton
                  onClick={() => goToNextLesson(type, selectedIndex)}
                  disabled={selectedIndex >= sectionLessons.length - 1}
                >
                  →
                </ArrowButton>
              </div>
            </>
          ) : (
            <p>Video not available yet</p>
          )}
        </LessonContainer>
      </Section>
    );
  };

  return (
    <Container>
      <Header>
        <Title>Lessons ({langMap[language]})</Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TooltipContainer
            onMouseEnter={() => setShowQuizTooltip(true)}
            onMouseLeave={() => setShowQuizTooltip(false)}
          >
            <NavButton 
              onClick={handleQuizClick}
              disabled={calculateProgressPercentage() !== 100}
            >
              {translations[language].quiz}
            </NavButton>
            {calculateProgressPercentage() !== 100 && (
              <Tooltip show={showQuizTooltip}>
                {translations[language].completeProgress}
              </Tooltip>
            )}
          </TooltipContainer>
          <LanguageSelect 
            value={language} 
            onChange={(e) => onLanguageChange(e.target.value)}
          >
            <option value="english">English</option>
            <option value="hindi">हिंदी</option>
            <option value="telugu">తెలుగు</option>
          </LanguageSelect>
          <TooltipContainer
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <NavButton onClick={() => navigate('/qa')}>
              {translations[language].qa}
            </NavButton>
            <Tooltip show={showTooltip}>
              {translations[language].qaTooltip}
            </Tooltip>
          </TooltipContainer>
          <NavButton onClick={() => navigate('/dashboard')}>{translations[language].viewProgress}</NavButton>
          
          <UserDropdown className="user-dropdown">
            <TooltipContainer
              onMouseEnter={() => setShowUserTooltip(true)}
              onMouseLeave={() => setShowUserTooltip(false)}
            >
              <UserIcon onClick={() => setShowUserDropdown(!showUserDropdown)}>
                👤
              </UserIcon>
              <Tooltip show={showUserTooltip} alignLeft>
                {translations[language].userTooltip}
              </Tooltip>
            </TooltipContainer>
            <DropdownMenu show={showUserDropdown}>
              <DropdownItem onClick={() => {
                setShowUserDropdown(false);
                navigate('/profile');
              }}>
📝 {translations[language].profile}
              </DropdownItem>
              <DropdownItem onClick={() => {
                setShowUserDropdown(false);
                onLogout();
              }}>
🚪 {translations[language].logout}
              </DropdownItem>
            </DropdownMenu>
          </UserDropdown>
        </div>
      </Header>
      
      <WelcomeMessage>{translations[language].welcome}, {getDisplayName(user?.username)}!</WelcomeMessage>
      
      <SectionsContainer>
        {renderSection(computerLessons, selectedComputer, setSelectedComputer, 'computer')}
        {renderSection(mobileLessons, selectedMobile, setSelectedMobile, 'mobile')}
      </SectionsContainer>
    </Container>
  );
}

export default Lessons;