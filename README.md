# Lobby - Developer Community Hub

A comprehensive platform connecting developers through communities, hackathons, and collaborative features.

## 🚀 Features

- **Community Management**: Create and join developer communities
- **AI-Powered Hackathon Insights**: Automatic hackathon analysis with summaries, eligibility, and key details
- **Deadline Tracking**: Centralized deadline management across all communities
- **User Profiles**: Dynamic profile stats and activity tracking
- **Real-time Chat**: Community discussions and collaboration
- **Authentication**: Secure user authentication with profile management

## 💻 Tech Stack

### Frontend
- **React 18.2.0** - Modern UI framework
- **React Router DOM 7.9.3** - Client-side routing
- **CSS3** - Advanced styling with animations and gradients
- **localStorage** - Client-side data persistence

### Backend
- **Python 3.8+** with Flask 3.0.0
- **Flask-CORS 4.0.0** - Cross-origin resource sharing
- **BeautifulSoup4 4.12.0** - Web scraping
- **DuckDuckGo Search** - Free search integration
- **Requests 2.31.0** - HTTP library

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- Python 3.8 or higher
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

The backend runs on `http://localhost:5000`  
The frontend runs on `http://localhost:3000`

## 🏗️ Project Structure

```
my-react-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── App.js
│   ├── App.css
│   └── index.js
├── backend/
│   ├── app.py
│   └── requirements.txt
└── package.json
```

## 🎯 Key Features Explained

### AI Hackathon Analysis
- Automatic web scraping of hackathon information
- Rule-based AI summary generation
- Eligibility checking and deadline extraction
- No paid API dependencies (100% free)

### Community System
- Create communities with custom details
- Join/leave functionality with confirmation
- Member management
- Integrated chat and deadline tracking

### Profile Management
- Dynamic statistics calculation
- Activity tracking
- Profile customization
- Achievement system

## 🔧 Configuration

Environment variables are not required for basic functionality. The app uses:
- localStorage for data persistence
- Hardcoded backend URL (`http://localhost:5000`)

For production deployment, update API URLs in the frontend code.

## 📄 License

This project is open source and available for educational purposes.

## 👥 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📚 Additional Documentation

For detailed technical information about the tech stack, see [LANGUAGES_AND_TECH_USED.md](./LANGUAGES_AND_TECH_USED.md)

For backend API documentation, see [backend/README.md](./backend/README.md)
