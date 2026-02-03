import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const QuizSection = styled.div`
  max-width: 600px;
  width: 100%;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const QuestionTitle = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const QuestionContent = styled.div`
  margin-bottom: 30px;
`;

const Question = styled.h3`
  color: #333;
  margin-bottom: 20px;
`;

const OptionLabel = styled.label`
  display: block;
  margin: 10px 0;
  cursor: pointer;
  padding: 10px;
  border-radius: 5px;
  transition: background 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'secondary' ? '#6c757d' : props.variant === 'success' ? '#28a745' : '#007bff'};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 10px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ResultsContainer = styled.div`
  text-align: center;
`;

const quizData = {
  english: [
    { q: 'How do you turn on a computer?', options: ['Press power button', 'Shake it', 'Clap hands'], correct: 0 },
    { q: 'What is used to click on screen items?', options: ['Keyboard', 'Mouse', 'Monitor'], correct: 1 },
    { q: 'Where do you type text?', options: ['Mouse', 'Monitor', 'Keyboard'], correct: 2 },
    { q: 'How do you make a phone call?', options: ['Dial number and press call', 'Shake phone', 'Press volume'], correct: 0 },
    { q: 'What app is used for messaging?', options: ['Camera', 'WhatsApp', 'Calculator'], correct: 1 }
  ],
  hindi: [
    { q: 'कंप्यूटर कैसे चालू करते हैं?', options: ['पावर बटन दबाएं', 'हिलाएं', 'ताली बजाएं'], correct: 0 },
    { q: 'स्क्रीन पर क्लिक करने के लिए क्या उपयोग करते हैं?', options: ['कीबोर्ड', 'माउस', 'मॉनिटर'], correct: 1 },
    { q: 'टेक्स्ट कहाँ टाइप करते हैं?', options: ['माउस', 'मॉनिटर', 'कीबोर्ड'], correct: 2 },
    { q: 'फोन कॉल कैसे करते हैं?', options: ['नंबर डायल करें और कॉल दबाएं', 'फोन हिलाएं', 'वॉल्यूम दबाएं'], correct: 0 },
    { q: 'मैसेजिंग के लिए कौन सा ऐप उपयोग करते हैं?', options: ['कैमरा', 'व्हाट्सएप', 'कैलकुलेटर'], correct: 1 }
  ],
  telugu: [
    { q: 'కంప్యూటర్ ఎలా ఆన్ చేయాలి?', options: ['పవర్ బటన్ నొక్కండి', 'వణుకు', 'చప్పట్లు కొట్టండి'], correct: 0 },
    { q: 'స్క్రీన్ మీద క్లిక్ చేయడానికి ఏమి వాడతారు?', options: ['కీబోర్డ్', 'మౌస్', 'మానిటర్'], correct: 1 },
    { q: 'టెక్స్ట్ ఎక్కడ టైప్ చేస్తారు?', options: ['మౌస్', 'మానిటర్', 'కీబోర్డ్'], correct: 2 },
    { q: 'ఫోన్ కాల్ ఎలా చేయాలి?', options: ['నంబర్ డయల్ చేసి కాల్ నొక్కండి', 'ఫోన్ వణుకు', 'వాల్యూమ్ నొక్కండి'], correct: 0 },
    { q: 'మెసేజింగ్ కోసం ఏ యాప్ వాడతారు?', options: ['కెమెరా', 'వాట్సాప్', 'కాలిక్యులేటర్'], correct: 1 }
  ]
};

const text = {
  english: {
    complete: 'Quiz Complete!',
    score: 'Your Score:',
    enterName: 'Enter your name for certificate',
    generateCert: 'Generate Certificate',
    backToLessons: 'Back to Lessons',
    enterNameAlert: 'Please enter your name',
    certDownloaded: 'Certificate downloaded successfully!',
    tryAgain: 'Try Again',
    congratulations: 'Congratulations!',
    perfectScore: 'Perfect Score! Your certificate has been generated.',
    downloadCert: 'Download Certificate'
  },
  hindi: {
    complete: 'क्विज़ पूर्ण!',
    score: 'आपका स्कोर:',
    enterName: 'प्रमाणपत्र के लिए अपना नाम दर्ज करें',
    generateCert: 'प्रमाणपत्र बनाएं',
    backToLessons: 'पाठों पर वापस जाएं',
    enterNameAlert: 'कृपया अपना नाम दर्ज करें',
    certDownloaded: 'प्रमाणपत्र सफलतापूर्वक डाउनलोड हो गया!',
    tryAgain: 'फिर से कोशिश करें',
    congratulations: 'बधाई हो!',
    perfectScore: 'परफेक्ट स्कोर! आपका प्रमाणपत्र तैयार हो गया है।',
    downloadCert: 'प्रमाणपत्र डाउनलोड करें'
  },
  telugu: {
    complete: 'క్విజ్ పూర్తయింది!',
    score: 'మీ స్కోర్:',
    enterName: 'సర్టిఫికేట్ కోసం మీ పేరు నమోదు చేయండి',
    generateCert: 'సర్టిఫికేట్ రూపొందించండి',
    backToLessons: 'పాఠాలకు తిరిగి వెళ్లండి',
    enterNameAlert: 'దయచేసి మీ పేరు నమోదు చేయండి',
    certDownloaded: 'సర్టిఫికేట్ విజయవంతంగా డౌన్లోడ్ అయింది!',
    tryAgain: 'మళ్లీ ప్రయత్నించండి',
    congratulations: 'అభినందనలు!',
    perfectScore: 'పర్ఫెక్ట్ స్కోర్! మీ సర్టిఫికేట్ తయారు అయింది.',
    downloadCert: 'సర్టిఫికేట్ డౌన్లోడ్ చేయండి'
  }
};

function Quiz({ language, user }) {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  
  const questions = quizData[language] || quizData.english;
  const t = text[language] || text.english;

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setShowCertificate(false);
  };

  const selectAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = async () => {
    if (currentQuestion === questions.length - 1) {
      const score = calculateScore();
      setShowResults(true);
      if (score === questions.length) {
        // Save certificate to backend
        try {
          const token = localStorage.getItem('token');
          await fetch('/api/certificate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ score, totalQuestions: questions.length })
          });
        } catch (error) {
          console.error('Error saving certificate:', error);
        }
        setTimeout(() => setShowCertificate(true), 1000);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });
    return score;
  };

  const generateCertificate = (username) => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 700;
    const ctx = canvas.getContext('2d');
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 900, 700);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 700);
    
    // White inner background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, 40, 820, 620);
    
    // Decorative border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 8;
    ctx.strokeRect(60, 60, 780, 580);
    
    // Inner decorative border
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 80, 740, 540);
    
    // Certificate title with gradient
    const titleGradient = ctx.createLinearGradient(0, 120, 900, 120);
    titleGradient.addColorStop(0, '#667eea');
    titleGradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = titleGradient;
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 CERTIFICATE OF ACHIEVEMENT 🏆', 450, 160);
    
    // Subtitle
    ctx.fillStyle = '#28a745';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('Digital Literacy Excellence', 450, 200);
    
    // Main text
    ctx.fillStyle = '#333';
    ctx.font = '28px Arial';
    ctx.fillText('This is to proudly certify that', 450, 280);
    
    // Username with highlight
    ctx.fillStyle = '#667eea';
    ctx.font = 'bold 42px Arial';
    ctx.fillText(username, 450, 340);
    
    // Achievement details
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.fillText('has successfully completed', 450, 400);
    
    ctx.fillStyle = '#28a745';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('✓ 100% Course Progress', 450, 440);
    ctx.fillText('✓ Perfect Quiz Score (5/5)', 450, 480);
    
    ctx.fillStyle = '#333';
    ctx.font = '24px Arial';
    ctx.fillText('in the Digital Literacy Program', 450, 520);
    
    // Date and signature area
    ctx.fillStyle = '#666';
    ctx.font = '20px Arial';
    ctx.fillText('Date: ' + new Date().toLocaleDateString(), 450, 580);
    
    // Decorative elements
    ctx.fillStyle = '#ffd700';
    ctx.font = '40px Arial';
    ctx.fillText('⭐', 200, 350);
    ctx.fillText('⭐', 700, 350);
    ctx.fillText('🎓', 450, 600);
    
    return canvas.toDataURL();
  };

  const downloadCertificate = () => {
    const dataUrl = generateCertificate(user?.username || 'Student');
    const link = document.createElement('a');
    link.download = `certificate-${user?.username?.replace(/\s+/g, '-') || 'student'}.png`;
    link.href = dataUrl;
    link.click();
    alert(t.certDownloaded);
  };

  if (showCertificate) {
    const certificateDataUrl = generateCertificate(user?.username || 'Student');
    return (
      <Container>
        <QuizSection>
          <ResultsContainer>
            <h3>{t.congratulations}</h3>
            <p>{t.perfectScore}</p>
            <div style={{ margin: '20px 0', border: '2px solid #007bff', borderRadius: '10px', padding: '10px' }}>
              <img src={certificateDataUrl} alt="Certificate" style={{ width: '100%', maxWidth: '600px' }} />
            </div>
            <Button variant="success" onClick={downloadCertificate}>
              {t.downloadCert}
            </Button>
            <br />
            <Button onClick={() => navigate('/lessons')}>
              {t.backToLessons}
            </Button>
          </ResultsContainer>
        </QuizSection>
      </Container>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <Container>
        <QuizSection>
          <ResultsContainer>
            <h3>{t.complete}</h3>
            <p>{t.score} {score}/{questions.length}</p>
            {score < questions.length && (
              <Button variant="success" onClick={resetQuiz}>
                {t.tryAgain}
              </Button>
            )}
            <br />
            <Button onClick={() => navigate('/lessons')}>
              {t.backToLessons}
            </Button>
          </ResultsContainer>
        </QuizSection>
      </Container>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Container>
      <QuizSection>
        <QuestionTitle>Question {currentQuestion + 1} of {questions.length}</QuestionTitle>
        <QuestionContent>
          <Question>{question.q}</Question>
          <div>
            {question.options.map((option, index) => (
              <OptionLabel key={index}>
                <input
                  type="radio"
                  name="answer"
                  value={index}
                  checked={answers[currentQuestion] === index}
                  onChange={() => selectAnswer(index)}
                />
                {' '}{option}
              </OptionLabel>
            ))}
          </div>
        </QuestionContent>
        <div style={{ textAlign: 'center' }}>
          {currentQuestion > 0 && (
            <Button variant="secondary" onClick={prevQuestion}>
              Previous
            </Button>
          )}
          <Button onClick={nextQuestion}>
            {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </QuizSection>
    </Container>
  );
}

export default Quiz;