const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/csp-learning')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  language: { type: String, default: 'english' },
  progress: {
    computer: [{ lessonId: String, completed: Boolean, watchTime: Number }],
    mobile: [{ lessonId: String, completed: Boolean, watchTime: Number }]
  },
  certificate: {
    earned: { type: Boolean, default: false },
    dateEarned: { type: Date },
    score: { type: Number }
  }
});

const User = mongoose.model('User', userSchema);

// Video data from lessons.html
const videoData = {
  telugu: {
    computer: ['1mmAf5emWCp6d7PLnKBBTZKnOmaKMTFlD', '1NqdN3ERi4V9EbbLvLmpWbSp_IKlTmdbF', '193IRIfv2QFcpHhE1wCB-63jr2rd7Pijf', '1Dmsg17FsquXuy8k_SGF8o6dvTz5KOKsH', '1y-ElFiRXvNE5StQ38RAT8prDb74N0lBT', '1K3gcv0Pp7EQgF9yVaiHFhy7ahY1qC9ac'],
    mobile: ['10Qj7oM72HuI0Ku9sXeyitIdZkUrNFDuw', '14Ri4cGe2MYIGwmhNBkPPYlcG54hX-Md0', '1m26Deu4cXIG65Pal3hbKRZhhNlDeUoHN', '13xXMT-yMDxiKtiMtN9pf8E397-2J-512', '1ubmwP7lT3S27sGoicyHYtHD7KGQFs-Gy', '1gyXp3FCc2R5IpAZgyONCKw3_a3nDOr7s']
  },
  hindi: {
    computer: ['1QtF5qq__QDfL3YIroBiqMjR5-tsYWBre', '1Y5OKNQ8Jx8vHAE8LJqidPugPpY9JF0Hs', '1F71eRngkEC2b92sg4qqOmSTWW46fxQ8H', '1dwdrQepYSuQy2xvVSAFKEzRq7ZadQZGW', '17tjynv6W4HBw2Dou9IMujUqBC_wxG3NT', '15_TzIL7YeAYl8Ly0rGKEAyfm7NixRHFU'],
    mobile: ['1bSuLi_9Ew1mTbTn-aUptQVhoD7uccjy1', '1j3fAeA-B0VywjXTedxj_-X5ReCGbwhYV', '1PuK4zFSGF1sMwm5V2awbGE9VKepGf1_z', '17npEwRWbeYgYnesMCi07Kz7CTL4A51gq', '1tvTs51djoRP_Ip3oGWu1fHIbNJ7UCyu6', '1E0IIOaboJ6tuOgFJqkQRFkZXc91k_RRd']
  },
  english: {
    computer: ['1DVqGDpoIsu4aVbXUGoaS1wSqzFCBwNLE', '1hrk65Gj8Eji2sBFvjI_8pTaNBL-ara8o', '1pXEC4ePTuW6j7G3GmlbG0y_bamjiZAqw', '1PTxQikVm9KPX-KUZt854PGXc-L_KzCmy', '1seKjTi9VcZamREYs29pXfX6BTzCGGNNw', '10K5QVPDfBVajpFyBe7hDsPiXMsNiGJSd'],
    mobile: ['1VhqLPSUVFkl3pQE6Y893_CyCdEaoNcmZ', '1qUVebjOgxCf1SRFlWVBQ99BapaQxwDRO', '11C7C3aw2wbxVMjAsY7zL2u35qs5selII', '1hTwh0HrNgBGuR10oDwixs3oYR-GJX4Wc', '1USaf0XYOEsz7uwrAY930mpfPFXL32NAx', '1bL4fjhhuo08tJ0CmC8EtrwBtaNVrWyiJ']
  }
};

const lessonsData = [
  { key: 'computer1', type: 'computer', titles: { english: 'Turning on/off a computer', hindi: 'कंप्यूटर चालू/बंद करना', telugu: 'కంప్యూటర్ ఆన్/ఆఫ్ చేయడం' }},
  { key: 'computer2', type: 'computer', titles: { english: 'Using a mouse and keyboard', hindi: 'माउस और कीबोर्ड का उपयोग', telugu: 'మౌస్ మరియు కీబోర్డ్ వాడకం' }},
  { key: 'computer3', type: 'computer', titles: { english: 'Understanding the desktop environment', hindi: 'डेस्कटॉप वातावरण को समझना', telugu: 'డెస్క్టాప్ వాతావరణాన్ని అర్థం చేసుకోవడం' }},
  { key: 'computer4', type: 'computer', titles: { english: 'Basic file management (creating folders, saving files)', hindi: 'मूल फ़ाइल प्रबंधन (फोल्डर बनाना, फ़ाइलें सहेजना)', telugu: 'ప్రాథమిక ఫైల్ నిర్వహణ (ఫోల్డర్లు సృష్టించడం, ఫైళ్లను సేవ్ చేయడం)' }},
  { key: 'computer5', type: 'computer', titles: { english: 'Introduction to the internet and web browsing', hindi: 'इंटरनेट और वेब ब्राउज़िंग का परिचय', telugu: 'ఇంటర్నెట్ మరియు వెబ్ బ్రౌజింగ్ పరిచయం' }},
  { key: 'computer6', type: 'computer', titles: { english: 'Understanding online safety and privacy', hindi: 'ऑनलाइन सुरक्षा और गोपनीयता को समझना', telugu: 'ఆన్లైన్ భద్రత మరియు గోప్యతను అర్థం చేసుకోవడం' }},
  { key: 'mobile1', type: 'mobile', titles: { english: 'Turning On/off a Mobile', hindi: 'मोबाइल चालू/बंद करना', telugu: 'మొబైల్ ఆన్/ఆఫ్ చేయడం' }},
  { key: 'mobile2', type: 'mobile', titles: { english: 'Making and receiving calls', hindi: 'कॉल करना और प्राप्त करना', telugu: 'కాల్ చేయడం మరియు స్వీకరించడం' }},
  { key: 'mobile3', type: 'mobile', titles: { english: 'Sending and receiving messages', hindi: 'संदेश भेजना और प्राप्त करना', telugu: 'సందేశాలు పంపడం మరియు స్వీకరించడం' }},
  { key: 'mobile4', type: 'mobile', titles: { english: 'Using basic apps (camera, gallery, calculator)', hindi: 'मूल ऐप्स का उपयोग (कैमरा, गैलरी, कैलकुलेटर)', telugu: 'ప్రాథమిక యాప్స్ వాడకం (కెమెరా, గ్యాలరీ, కాలిక్యులేటర్)' }},
  { key: 'mobile5', type: 'mobile', titles: { english: 'Connecting to Wi-Fi', hindi: 'वाई-फाई से कनेक्ट करना', telugu: 'వై-ఫైకి కనెక్ట్ అవ్వడం' }},
  { key: 'mobile6', type: 'mobile', titles: { english: 'Using online communication tools (e.g., WhatsApp)', hindi: 'ऑनलाइन संचार उपकरणों का उपयोग (जैसे, व्हाट्सएप)', telugu: 'ఆన్లైన్ కమ్యూనికేషన్ టూల్స్ వాడకం (ఉదా: వాట్సాప్)' }}
];

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, language } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, language });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, username, language } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: user._id, username: user.username, language: user.language } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/lessons', auth, (req, res) => {
  const { language } = req.query;
  const lessons = lessonsData.map((lesson, index) => ({
    ...lesson,
    videoId: videoData[language]?.[lesson.type]?.[lesson.type === 'computer' ? index : index - 6]
  }));
  res.json(lessons);
});

app.post('/api/progress', auth, async (req, res) => {
  try {
    const { lessonId, type, completed, watchTime } = req.body;
    const user = await User.findById(req.user.userId);
    const progressArray = user.progress[type];
    const existingIndex = progressArray.findIndex(p => p.lessonId === lessonId);
    
    if (existingIndex >= 0) {
      progressArray[existingIndex] = { lessonId, completed, watchTime };
    } else {
      progressArray.push({ lessonId, completed, watchTime });
    }
    
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user.progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/profile', auth, async (req, res) => {
  try {
    const { username, language } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      user.username = username;
    }
    
    if (language) {
      user.language = language;
    }
    
    await user.save();
    res.json({ user: { id: user._id, username: user.username, language: user.language } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/certificate', auth, async (req, res) => {
  try {
    const { score, totalQuestions } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (score === totalQuestions) {
      user.certificate = {
        earned: true,
        dateEarned: new Date(),
        score: score
      };
      await user.save();
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/certificate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.certificate = {
      earned: false,
      dateEarned: null,
      score: 0
    };
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));