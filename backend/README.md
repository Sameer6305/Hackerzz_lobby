# AI-Powered Hackathon Information System - Backend

## Overview
This Flask backend provides AI-powered hackathon analysis using Claude API and web scraping.

## Technologies Used

### Backend Framework
- **Flask 3.0.0**: Lightweight Python web framework for building REST APIs
- **Flask-CORS**: Handles Cross-Origin Resource Sharing for React frontend

### AI & Analysis
- **Anthropic Claude API (claude-3-5-sonnet-20241022)**: 
  - Latest Claude model for intelligent text analysis
  - Summarizes hackathon information
  - Extracts technologies, tools, timelines
  - Generates relevant project recommendations
  - Provides contextual tool guides

### Web Scraping & Search
- **Requests 2.31.0**: HTTP library for fetching web pages
- **BeautifulSoup4 4.12.0**: HTML/XML parser for extracting content
- **Google Custom Search API**: Finds official hackathon pages
  - Returns top 3 most relevant results
  - Provides snippets for context

### Utilities
- **python-dotenv 1.0.0**: Loads environment variables from .env file
- **urllib**: URL parsing and validation

## Installation

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Set Up Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Anthropic Claude API Key (Required)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google Custom Search API (Optional but recommended)
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_CSE_ID=your_custom_search_engine_id_here
```

### 3. Get API Keys

#### Anthropic Claude API Key (Required)
1. Visit https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy and paste into .env file

#### Google Custom Search API (Optional)
1. Visit https://developers.google.com/custom-search/v1/overview
2. Enable Custom Search API
3. Create API credentials
4. Create a Custom Search Engine at https://cse.google.com/cse/
5. Copy API key and CSE ID to .env file

## API Endpoints

### POST /api/analyze-hackathon
Analyzes a hackathon and returns AI-generated insights.

**Request:**
```json
{
  "hackathon_name": "MLH Hackathon 2025"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hackathon_name": "MLH Hackathon 2025",
    "source_url": "https://...",
    "analyzed_at": "2025-10-19 10:30:00",
    "summary": "Brief hackathon summary",
    "technologies": [
      {
        "name": "React",
        "description": "Frontend framework for building UI",
        "difficulty": "Intermediate"
      }
    ],
    "timeline": {
      "registration_deadline": "Nov 1, 2025",
      "submission_deadline": "Nov 15, 2025",
      "current_stage": "Registration Open"
    },
    "requirements": ["Requirement 1", "Requirement 2"],
    "reference_projects": [
      {
        "title": "Project Title",
        "description": "What it does",
        "github_url": "https://github.com/...",
        "relevance": "Why it's relevant"
      }
    ],
    "tool_guides": [
      {
        "tool_name": "React",
        "quick_start": "Getting started guide",
        "key_resources": ["Resource 1", "Resource 2"],
        "hackathon_context": "How to use for this hackathon"
      }
    ],
    "tips": ["Tip 1", "Tip 2", "Tip 3"]
  }
}
```

### GET /api/health
Health check endpoint to verify server is running.

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Hackathon Analyzer",
  "version": "1.0.0"
}
```

## Running the Server

### Development Mode
```bash
cd backend
python app.py
```
Server runs on http://localhost:5000

### Production Mode
```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## How It Works

### 1. Web Search
- Uses Google Custom Search API to find official hackathon pages
- Returns top 3 most relevant results with snippets

### 2. Web Scraping
- Fetches HTML content from the top search result
- Uses BeautifulSoup to extract text content
- Removes unnecessary elements (scripts, styles, navigation)
- Limits content to 8000 characters to optimize API usage

### 3. AI Analysis (Claude)
- Sends hackathon name, web content, and search snippets to Claude
- Claude analyzes the information using its latest model
- Generates structured JSON response with:
  - Summary
  - Technologies and tools
  - Timeline information
  - Requirements
  - Relevant reference projects
  - Tool guides with hackathon-specific context
  - Practical tips

### 4. Response Formatting
- Validates and parses Claude's JSON response
- Adds metadata (source URL, timestamp)
- Returns to frontend for display

## Error Handling
- API key validation on startup
- Graceful fallbacks if web search fails
- Timeout handling for web requests
- JSON parsing error recovery
- Detailed error messages for debugging

## Security Considerations
- API keys stored in .env file (not committed to git)
- CORS configured for frontend origin
- Request timeout limits
- Content length limits to prevent abuse
- User-Agent headers for ethical web scraping

## Integration with Frontend
The backend is designed to work seamlessly with the React frontend:
1. Frontend sends hackathon name on user enrollment
2. Backend analyzes and returns structured data
3. Frontend displays information in professional format
4. All communication via REST API (JSON)

## Future Enhancements
- Caching of analyzed hackathons to reduce API calls
- Support for multiple AI models
- Real-time progress updates via WebSockets
- Database storage for historical analysis
- Rate limiting and authentication
