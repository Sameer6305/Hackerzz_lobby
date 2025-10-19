# 🚀 Quick Start Guide - AI Hackathon Information System

## ⚡ 5-Minute Setup

### 1. Install Backend Dependencies (2 min)

```bash
cd backend
pip install flask flask-cors requests beautifulsoup4 anthropic python-dotenv
```

### 2. Create `.env` File (1 min)

Create `backend/.env`:
```env
ANTHROPIC_API_KEY=your_key_here
```

**Get your key**: https://console.anthropic.com/ → API Keys → Create

### 3. Start Backend (30 sec)

```bash
cd backend
python app.py
```

You should see: `Running on http://127.0.0.1:5000`

### 4. Start Frontend (30 sec)

In a new terminal:
```bash
npm start
```

### 5. Load Sample Data (1 min)

1. Open browser at `http://localhost:3000`
2. Open Console (F12)
3. Paste this:

```javascript
const hackathons = [
  {
    id: 'hack-1',
    name: 'MLH Hackathon 2025',
    hackathonName: 'MLH Hackathon 2025',
    description: 'Major League Hacking premier event',
    projectDomain: 'Full Stack',
    projectName: 'Innovation',
    hackathonUrl: 'https://mlh.io',
    numberOfMembers: 0,
    members: [],
    messages: [],
    deadlines: []
  }
];

localStorage.setItem('communities', JSON.stringify(hackathons));
location.reload();
```

### 6. Test It! (30 sec)

1. Go to Communities page
2. Click "MLH Hackathon 2025"
3. Click "Join Community"
4. Wait 10-20 seconds (AI is analyzing!)
5. Click "Information" tab
6. See the AI magic! 🤖✨

---

## 🎯 What You'll See

When you click Information tab after enrolling:

✅ **AI-Generated Summary** (purple gradient card)
✅ **Timeline & Deadlines** (registration, submission)
✅ **Required Technologies** (React, Node.js, etc. with difficulty)
✅ **Reference Projects** (GitHub repos with explanations)
✅ **Tool Guides** (How to use each technology)
✅ **Practical Tips** (Numbered list of advice)

---

## ⚠️ Troubleshooting

**Backend won't start?**
```bash
pip install -r backend/requirements.txt
```

**"API key not found"?**
- Check `backend/.env` exists
- Verify key starts with `sk-ant-`

**Frontend can't connect?**
- Backend must run on port 5000
- Check console for CORS errors

**No AI analysis showing?**
- Wait 20-30 seconds after enrolling
- Check backend terminal for errors
- Verify you clicked "Join Community"

---

## 📁 Files Changed

- ✅ `backend/app.py` (NEW)
- ✅ `backend/requirements.txt` (NEW)
- ✅ `backend/.env` (YOU CREATE)
- ✅ `src/CommunityPage.js` (MODIFIED)
- ✅ `src/App.css` (MODIFIED - AI styles added)
- ✅ `src/utils/sampleHackathons.js` (NEW)

---

## 🎨 Professional Features

- **Gradient backgrounds** for AI sections
- **Animated loading spinner** during analysis
- **Hover effects** on all cards
- **Difficulty badges** (Beginner/Intermediate/Advanced)
- **GitHub integration** with project links
- **Mobile responsive** design
- **Error handling** with retry button

---

## 💰 Cost Estimate

**Anthropic Claude API:**
- ~$0.01 - $0.03 per hackathon analysis
- First $5 free credit for new accounts
- 100-200 analyses per $5

**Google Search API (Optional):**
- 100 searches/day free
- Not required (Claude can work without it)

---

## 🌟 Next Steps

1. **Add more hackathons** to communities
2. **Customize AI prompt** in `backend/app.py`
3. **Adjust styling** in `src/App.css`
4. **Add caching** to reduce API calls
5. **Deploy to production** (Heroku/Render/Vercel)

---

## 📚 Full Documentation

See `AI_HACKATHON_SYSTEM.md` for complete guide.

---

**Happy Hacking! 🚀**
