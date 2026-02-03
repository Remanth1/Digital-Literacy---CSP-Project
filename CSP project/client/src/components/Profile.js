import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
`;

const Title = styled.h1`
  color: #333;
  margin: 0;
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background: #5a6fd8;
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

const EditButton = styled.button`
  padding: 10px 20px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  
  &:hover {
    background: #218838;
  }
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  
  &:hover {
    background: #0056b3;
  }
`;

const CancelButton = styled.button`
  padding: 8px 16px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 5px;
  
  &:hover {
    background: #545b62;
  }
`;

const ProfileCard = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const UserIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-weight: bold;
  color: #666;
`;

const Value = styled.span`
  color: #333;
`;

const CertificateSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  border: 2px solid #28a745;
  border-radius: 10px;
  background: #f8fff8;
`;

const CertificateTitle = styled.h3`
  color: #28a745;
  margin-bottom: 15px;
`;

const CertificateImage = styled.img`
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 10px 0;
`;

const DownloadButton = styled.button`
  background: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 5px;
  
  &:hover {
    background: #218838;
  }
`;

const RemoveButton = styled.button`
  background: #dc3545;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 5px;
  
  &:hover {
    background: #c82333;
  }
`;

const translations = {
  english: {
    profile: 'Profile',
    username: 'Username',
    language: 'Language',
    backToLessons: 'Back to Lessons',
    logout: 'Logout',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    certificateEarned: 'Certificate Earned',
    dateEarned: 'Date Earned',
    downloadCert: 'Download Certificate',
    removeCert: 'Ignore'
  },
  hindi: {
    profile: 'प्रोफ़ाइल',
    username: 'उपयोगकर्ता नाम',
    language: 'भाषा',
    backToLessons: 'पाठों पर वापस जाएं',
    logout: 'लॉगआउट',
    edit: 'संपादित करें',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    certificateEarned: 'प्रमाणपत्र प्राप्त',
    dateEarned: 'प्राप्ति की तारीख',
    downloadCert: 'प्रमाणपत्र डाउनलोड करें',
    removeCert: 'अनदेखा करें'
  },
  telugu: {
    profile: 'ప్రొఫైల్',
    username: 'వినియोगदारु पेरु',
    language: 'భाष',
    backToLessons: 'पाठालकु तिरिगि वेळ्लंडि',
    logout: 'లाग्आउट्',
    edit: 'సवरिंचु',
    save: 'సेव् चेयि',
    cancel: 'రद्दु चेयि',
    certificateEarned: 'సर्टिफिकेट् సंपादिंचिंदि',
    dateEarned: 'సंपादिंचिन तेदी',
    downloadCert: 'సर्टिफिकेट् డौन्लोड् चेयंडि'
  },
  telugu: {
    profile: 'ప్రొఫైల్',
    username: 'వినియोगदारु पेरु',
    language: 'भाष',
    backToLessons: 'पाठालकु तिरिगि वेळ्लंडि',
    logout: 'लाग्आउट्',
    edit: 'सवरिंचु',
    save: 'सेव् चेयि',
    cancel: 'रद्दु चेयि',
    certificateEarned: 'सर्टिफिकेट् संपादिंचिंदि',
    dateEarned: 'संपादिंचिन तेदी',
    downloadCert: 'सर्टिफिकेट् डौन्लोड् चेयंडि',
    removeCert: 'విడుచుకో'
  }
};

const langMap = {
  english: 'English',
  hindi: 'हिंदी',
  telugu: 'తెలుగు'
};

function Profile({ user, language, onLogout, onUserUpdate }) {
  const navigate = useNavigate();
  const t = translations[language] || translations.english;
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ username: user.username, language: user.language });
  const [userDetails, setUserDetails] = useState(user);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });
      
      if (response.ok) {
        const data = await response.json();
        onUserUpdate(data.user);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setEditData({ username: user.username, language: user.language });
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const userData = await response.json();
          setUserDetails(userData);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
    fetchUserDetails();
  }, []);

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
    ctx.fillText('Date: ' + new Date(userDetails.certificate?.dateEarned).toLocaleDateString(), 450, 580);
    
    // Decorative elements
    ctx.fillStyle = '#ffd700';
    ctx.font = '40px Arial';
    ctx.fillText('⭐', 200, 350);
    ctx.fillText('⭐', 700, 350);
    ctx.fillText('🎓', 450, 600);
    
    return canvas.toDataURL();
  };

  const downloadCertificate = () => {
    const dataUrl = generateCertificate(userDetails.username);
    const link = document.createElement('a');
    link.download = `certificate-${userDetails.username.replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();
  };

  const removeCertificate = async () => {
    if (window.confirm('Are you sure you want to remove your certificate?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/certificate', {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setUserDetails({ ...userDetails, certificate: { earned: false } });
        }
      } catch (error) {
        console.error('Error removing certificate:', error);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>{t.profile}</Title>
        <div>
          <BackButton onClick={() => navigate('/lessons')}>
            {t.backToLessons}
          </BackButton>
          {!isEditing && (
            <EditButton onClick={() => setIsEditing(true)}>
              {t.edit}
            </EditButton>
          )}
          <LogoutButton onClick={handleLogout}>
            {t.logout}
          </LogoutButton>
        </div>
      </Header>
      
      <ProfileCard>
        <UserIcon>👤</UserIcon>
        <h2>{user.username}</h2>
      </ProfileCard>
      
      <div>
        <DetailRow>
          <Label>{t.username}:</Label>
          {isEditing ? (
            <div>
              <Input
                value={editData.username}
                onChange={(e) => setEditData({...editData, username: e.target.value})}
              />
            </div>
          ) : (
            <Value>{user.username}</Value>
          )}
        </DetailRow>
        <DetailRow>
          <Label>{t.language}:</Label>
          {isEditing ? (
            <div>
              <Select
                value={editData.language}
                onChange={(e) => setEditData({...editData, language: e.target.value})}
              >
                <option value="english">English</option>
                <option value="hindi">हिंदी</option>
                <option value="telugu">తెలుగు</option>
              </Select>
              <SaveButton onClick={handleSave}>{t.save}</SaveButton>
              <CancelButton onClick={handleCancel}>{t.cancel}</CancelButton>
            </div>
          ) : (
            <Value>{langMap[user.language] || langMap[language]}</Value>
          )}
        </DetailRow>
      </div>
      
      {userDetails.certificate?.earned && (
        <CertificateSection>
          <CertificateTitle>{t.certificateEarned}</CertificateTitle>
          <DetailRow>
            <Label>{t.dateEarned}:</Label>
            <Value>{new Date(userDetails.certificate.dateEarned).toLocaleDateString()}</Value>
          </DetailRow>
          <CertificateImage 
            src={generateCertificate(userDetails.username)} 
            alt="Certificate" 
          />
          <br />
          <DownloadButton onClick={downloadCertificate}>
            {t.downloadCert}
          </DownloadButton>
          <RemoveButton onClick={removeCertificate}>
            {t.removeCert}
          </RemoveButton>
        </CertificateSection>
      )}
    </Container>
  );
}

export default Profile;