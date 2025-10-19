# System Architecture - AI Hackathon Information

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE (React)                      │
│                     http://localhost:3000                           │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                    1. User clicks "Join Community"
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    CommunityPage.js Component                       │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  handleJoinLeave() {                                          │ │
│  │    - User enrolls in hackathon                                │ │
│  │    - Trigger: fetchAIAnalysis(hackathonName)                  │ │
│  │  }                                                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
            2. POST /api/analyze-hackathon
            { "hackathon_name": "MLH Hackathon 2025" }
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   FLASK BACKEND (Python)                            │
│                   http://localhost:5000                             │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                     app.py                                     │ │
│  │                                                                │ │
│  │  Step 1: search_hackathon_page()                              │ │
│  │    ├─ Google Custom Search API                                │ │
│  │    ├─ Query: "MLH Hackathon 2025 official"                    │ │
│  │    └─ Returns: Top 3 URLs + snippets                          │ │
│  │                                                                │ │
│  │  Step 2: scrape_hackathon_page()                              │ │
│  │    ├─ Fetch HTML from top result                              │ │
│  │    ├─ BeautifulSoup parsing                                   │ │
│  │    ├─ Remove scripts, styles, nav                             │ │
│  │    └─ Extract text (max 8000 chars)                           │ │
│  │                                                                │ │
│  │  Step 3: analyze_with_claude()                                │ │
│  │    ├─ Anthropic Claude API                                    │ │
│  │    ├─ Model: claude-3-5-sonnet-20241022                       │ │
│  │    ├─ Input: Hackathon name + web content + snippets          │ │
│  │    └─ Output: Structured JSON analysis                        │ │
│  │                                                                │ │
│  │  Step 4: Return Response                                      │ │
│  │    └─ JSON with summary, tech, projects, guides, tips         │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                      3. External API Calls
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ↓                         ↓                         ↓
┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Google     │      │   Hackathon      │      │   Anthropic     │
│   Custom     │      │   Official       │      │   Claude API    │
│   Search     │      │   Website        │      │                 │
│              │      │                  │      │  AI Analysis &  │
│  Find URLs   │      │  Scrape Content  │      │  Summarization  │
└──────────────┘      └──────────────────┘      └─────────────────┘
                                  │
                                  │
                      4. Response JSON
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     Response Structure                              │
│  {                                                                  │
│    "success": true,                                                 │
│    "data": {                                                        │
│      "hackathon_name": "MLH Hackathon 2025",                       │
│      "source_url": "https://mlh.io",                               │
│      "analyzed_at": "2025-10-19 14:30:00",                         │
│      "summary": "2-3 sentence overview...",                        │
│      "technologies": [                                              │
│        { "name": "React", "description": "...", "difficulty": "..." }│
│      ],                                                             │
│      "timeline": {                                                  │
│        "registration_deadline": "Nov 1, 2025",                     │
│        "submission_deadline": "Nov 15, 2025",                      │
│        "current_stage": "Registration Open"                        │
│      },                                                             │
│      "requirements": [...],                                         │
│      "reference_projects": [...],                                   │
│      "tool_guides": [...],                                          │
│      "tips": [...]                                                  │
│    }                                                                │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                    5. Store in localStorage
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    Browser localStorage                             │
│  communities[index].aiAnalysis = data.data                          │
│  - Cached for instant re-access                                     │
│  - No repeated API calls                                            │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │
                    6. Display in UI
                                  │
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                   Information Tab (React UI)                        │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 🤖 AI-Powered Hackathon Summary                               │ │
│  │ ═══════════════════════════════════════════════════════════   │ │
│  │ [Purple gradient card with summary text]                      │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ⏰ Timeline & Deadlines                                        │ │
│  │ ───────────────────────────────────────────────────────────   │ │
│  │ Registration Deadline: Nov 1, 2025                            │ │
│  │ Submission Deadline: Nov 15, 2025                             │ │
│  │ Current Stage: [Registration Open]                            │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 🛠️ Required Technologies & Tools                              │ │
│  │ ───────────────────────────────────────────────────────────   │ │
│  │ [Grid of technology cards with difficulty badges]             │ │
│  │ React [Intermediate] | Node.js [Beginner] | ...               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 💡 Reference Projects                                          │ │
│  │ ───────────────────────────────────────────────────────────   │ │
│  │ [Cards with GitHub links and relevance explanations]          │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 📚 Tool Guides & Resources                                     │ │
│  │ ───────────────────────────────────────────────────────────   │ │
│  │ [Expandable guides for each tool]                             │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 💡 Practical Tips                                              │ │
│  │ ───────────────────────────────────────────────────────────   │ │
│  │ 1. Start with the simplest MVP                                │ │
│  │ 2. Focus on one core feature                                  │ │
│  │ 3. ...                                                         │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════
                            DATA FLOW SUMMARY
════════════════════════════════════════════════════════════════════════

Frontend (React)                Backend (Flask)              External APIs
─────────────────                ───────────────              ─────────────
                                                              
User Action                      API Endpoint                 Services
    │                                │                             │
    │ Join Community                 │                             │
    ├──────────────────────────────► │ analyze-hackathon           │
    │ POST request                   │                             │
    │                                │                             │
    │                                │ Search Web ────────────────►│ Google
    │                                │                             │
    │                                │ Scrape Page ───────────────►│ Website
    │                                │                             │
    │                                │ AI Analysis ───────────────►│ Claude
    │                                │                             │
    │ ◄──────────────────────────────│ JSON Response               │
    │ AI data received               │                             │
    │                                │                             │
    │ Store in localStorage          │                             │
    │                                │                             │
    │ Render UI                      │                             │
    │                                │                             │
    └─► User sees beautiful          │                             │
        AI-powered information        │                             │


════════════════════════════════════════════════════════════════════════
                         TECHNOLOGY STACK
════════════════════════════════════════════════════════════════════════

Frontend:                  Backend:                  AI/APIs:
- React 18                - Flask 3.0               - Claude 3.5 Sonnet
- Fetch API               - Flask-CORS              - Google Custom Search
- CSS3 (Gradients)        - Requests                - BeautifulSoup4
- localStorage            - Python 3.9+             - Anthropic SDK


════════════════════════════════════════════════════════════════════════
                      PROFESSIONAL STYLING
════════════════════════════════════════════════════════════════════════

Loading State:             AI Cards:                 Difficulty Badges:
┌─────────────┐           ┌──────────────┐          ┌──────────────┐
│  ███████    │           │  Gradient    │          │  Beginner    │
│  Spinner    │           │  Background  │          │  Green       │
│  🤖 AI is   │           │  Purple→Blue │          ├──────────────┤
│  analyzing  │           │  Shadow      │          │  Intermediate│
└─────────────┘           │  Hover       │          │  Orange      │
                          └──────────────┘          ├──────────────┤
                                                    │  Advanced    │
                                                    │  Red         │
                                                    └──────────────┘
```

**Legend:**
- `│` Flow direction
- `►` Action/Request
- `◄` Response/Data
- `┌─┐` UI Component
- `═══` Section divider
