import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  animation: slideIn 0.5s ease-out;
  
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #007bff, #28a745);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ChatContainer = styled.div`
  height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
`;

const Message = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 10px;
  animation: fadeIn 0.3s ease-in;
  ${props => props.isUser ? 
    'background: #007bff; color: white; text-align: right; margin-left: 20%;' : 
    'background: white; border: 1px solid #ddd; margin-right: 20%;'
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const SuggestedSection = styled.div`
  margin-bottom: 15px;
`;

const SuggestedTitle = styled.h4`
  margin-bottom: 10px;
  color: #333;
`;

const PromptButton = styled.button`
  display: block;
  width: 100%;
  margin: 5px 0;
  padding: 10px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  
  &:hover {
    background: #e9ecef;
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
  
  &:hover {
    background: #545b62;
  }
`;

const text = {
  english: {
    title: 'Digital Literacy Assistant',
    back: 'Back to Lessons',
    suggested: 'Suggested Questions:',
    welcome: 'Hello! Click on any question below to get help with digital literacy.'
  },
  hindi: {
    title: 'डिजिटल साक्षरता सहायक',
    back: 'पाठों पर वापस जाएं',
    suggested: 'सुझाए गए प्रश्न:',
    welcome: 'नमस्ते! डिजिटल साक्षरता में मदद पाने के लिए नीचे किसी भी प्रश्न पर क्लिक करें।'
  },
  telugu: {
    title: 'డిజిటల్ అక్షరాస్యత సహాయకుడు',
    back: 'పాఠాలకు తిరిగి వెళ్లండి',
    suggested: 'సూచించిన ప్రశ్నలు:',
    welcome: 'హలో! డిజిటల్ అక్షరాస్యతలో సహాయం పొందడానికి దిగువ ఏదైనా ప్రశ్నపై క్లిక్ చేయండి।'
  }
};

const prompts = {
  english: [
    { q: 'How to turn on a computer?', a: 'Press the power button on your computer. It\'s usually located on the front or side of the computer case.' },
    { q: 'How to use a mouse?', a: 'Hold the mouse with your dominant hand. Move it on a flat surface to move the cursor. Left-click to select, right-click for options.' },
    { q: 'How to connect to Wi-Fi?', a: 'Go to Settings > Wi-Fi on your device. Select your network name and enter the password.' },
    { q: 'How to make a phone call?', a: 'Open the phone app, dial the number using the keypad, and press the call button.' },
    { q: 'What is WhatsApp?', a: 'WhatsApp is a messaging app that lets you send text messages, photos, and make voice/video calls over the internet.' }
  ],
  hindi: [
    { q: 'कंप्यूटर कैसे चालू करें?', a: 'अपने कंप्यूटर पर पावर बटन दबाएं। यह आमतौर पर कंप्यूटर केस के सामने या बगल में होता है।' },
    { q: 'माउस का उपयोग कैसे करें?', a: 'माउस को अपने मुख्य हाथ से पकड़ें। कर्सर को हिलाने के लिए इसे समतल सतह पर हिलाएं। चुनने के लिए बाएं-क्लिक करें, विकल्पों के लिए दाएं-क्लिक करें।' },
    { q: 'वाई-फाई से कैसे जुड़ें?', a: 'अपने डिवाइस पर सेटिंग्स > वाई-फाई पर जाएं। अपना नेटवर्क नाम चुनें और पासवर्ड डालें।' },
    { q: 'फोन कॉल कैसे करें?', a: 'फोन ऐप खोलें, कीपैड का उपयोग करके नंबर डायल करें, और कॉल बटन दबाएं।' },
    { q: 'व्हाट्सएप क्या है?', a: 'व्हाट्सएप एक मैसेजिंग ऐप है जो आपको इंटरनेट पर टेक्स्ट मैसेज, फोटो भेजने और वॉयस/वीडियो कॉल करने की सुविधा देता है।' }
  ],
  telugu: [
    { q: 'కంప్యూటర్ ఎలా ఆన్ చేయాలి?', a: 'మీ కంప్యూటర్లో పవర్ బటన్ నొక్కండి. ఇది సాధారణంగా కంప్యూటర్ కేస్ ముందు లేదా పక్కన ఉంటుంది.' },
    { q: 'మౌస్ ఎలా వాడాలి?', a: 'మౌస్ను మీ ప్రధాన చేతితో పట్టుకోండి. కర్సర్ను కదిలించడానికి దానిని చదునైన ఉపరితలంపై కదిలించండి. ఎంచుకోవడానికి ఎడమ-క్లిక్ చేయండి, ఎంపికల కోసం కుడి-క్లిక్ చేయండి.' },
    { q: 'వై-ఫైకి ఎలా కనెక్ట్ అవ్వాలి?', a: 'మీ పరికరంలో సెట్టింగ్స్ > వై-ఫై వెళ్లండి. మీ నెట్వర్క్ పేరును ఎంచుకుని పాస్వర్డ్ నమోదు చేయండి.' },
    { q: 'ఫోన్ కాల్ ఎలా చేయాలి?', a: 'ఫోన్ యాప్ తెరవండి, కీప్యాడ్ ఉపయోగించి నంబర్ డయల్ చేసి, కాల్ బటన్ నొక్కండి.' },
    { q: 'వాట్సాప్ అంటే ఏమిటి?', a: 'వాట్సాప్ అనేది మెసేజింగ్ యాప్, ఇది మీకు ఇంటర్నెట్ ద్వారా టెక్స్ట్ మెసేజ్లు, ఫోటోలు పంపడానికి మరియు వాయిస్/వీడియో కాల్లు చేయడానికి అనుమతిస్తుంది.' }
  ]
};

function QA({ language }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const chatContainerRef = useRef(null);
  const t = text[language] || text.english;
  const currentPrompts = prompts[language] || prompts.english;

  useEffect(() => {
    setMessages([{ text: t.welcome, isUser: false }]);
  }, [language, t.welcome]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const showAnswer = (index) => {
    const prompt = currentPrompts[index];
    setMessages(prev => [
      ...prev,
      { text: prompt.q, isUser: true }
    ]);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { text: prompt.a, isUser: false }
      ]);
    }, 500);
  };

  return (
    <Container>
      <Title>{t.title}</Title>
      <ChatContainer ref={chatContainerRef}>
        {messages.map((message, index) => (
          <Message key={index} isUser={message.isUser}>
            {message.text}
          </Message>
        ))}
      </ChatContainer>
      <SuggestedSection>
        <SuggestedTitle>{t.suggested}</SuggestedTitle>
        {currentPrompts.map((prompt, index) => (
          <PromptButton key={index} onClick={() => showAnswer(index)}>
            {prompt.q}
          </PromptButton>
        ))}
      </SuggestedSection>
      <div style={{ textAlign: 'center' }}>
        <BackButton onClick={() => navigate('/lessons')}>
          {t.back}
        </BackButton>
      </div>
    </Container>
  );
}

export default QA;