# CSP Digital Literacy Platform

A multilingual Progressive Web App (PWA) for digital literacy education supporting English, Hindi, and Telugu languages.

## Features

- 📚 Interactive lessons for computer and mobile skills
- 🎯 Quiz system with certificate generation
- 🤖 AI chatbot for assistance
- 🌐 Multi-language support (English, Hindi, Telugu)
- 📱 PWA capabilities for mobile installation
- 📊 Progress tracking

## Local Development

### Frontend (Static Site)
The main application runs directly from `index.html` - no build process required.

### Backend (Optional)
```bash
cd server
npm install
cp .env.example .env
npm start
```

### Client (React - Optional)
```bash
cd client
npm install
npm start
```

## Project Structure

```
CSP/
├── index.html          # Main PWA application
├── styles.css          # Styling
├── manifest.json       # PWA manifest
├── client/            # React version (optional)
├── server/            # Node.js backend (optional)
└── README.md          # This file
```

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Progressive Web App (PWA)
- Google Drive API for video content
- Canvas API for certificate generation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request