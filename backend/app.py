"""
Flask Backend for AI-Powered Hackathon Information System
*** FREE PROTOTYPE VERSION - NO PAID APIs REQUIRED ***

This backend service:
1. Uses FREE web scraping to get hackathon information
2. Uses FREE rule-based analysis (no paid AI)
3. Generates intelligent summaries using templates
4. Provides relevant tools, technologies, and reference projects
5. Returns structured JSON for frontend display

Technologies Used:
- Flask: Web framework for REST API (FREE)
- Requests: HTTP library for web scraping (FREE)
- BeautifulSoup4: HTML parsing and web scraping (FREE)
- DuckDuckGo HTML Search: Free search alternative (FREE)
- Rule-based analysis: Pattern matching and templates (FREE)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse, quote_plus

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend


# FREE search using DuckDuckGo HTML (no API key needed!)
def search_hackathon_page(hackathon_name):
    """
    Search for hackathon's official page using FREE DuckDuckGo HTML search
    No API keys required!
    
    Args:
        hackathon_name (str): Name of the hackathon
        
    Returns:
        dict: Search results with URLs and snippets
    """
    try:
        # DuckDuckGo HTML search (completely free!)
        search_query = quote_plus(f"{hackathon_name} official hackathon")
        search_url = f"https://html.duckduckgo.com/html/?q={search_query}"
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(search_url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            results = soup.find_all('div', class_='result__body', limit=3)
            
            search_results = []
            for result in results:
                title_tag = result.find('a', class_='result__a')
                snippet_tag = result.find('a', class_='result__snippet')
                
                if title_tag:
                    search_results.append({
                        'title': title_tag.get_text(strip=True),
                        'link': title_tag.get('href', ''),
                        'snippet': snippet_tag.get_text(strip=True) if snippet_tag else ''
                    })
            
            if search_results:
                return {
                    'success': True,
                    'results': search_results
                }
        
        # Fallback: Use predefined URLs for common hackathons
        return get_fallback_results(hackathon_name)
        
    except Exception as e:
        print(f"Search error: {str(e)}")
        return get_fallback_results(hackathon_name)

# Fallback URLs for popular hackathons (completely free!)
def get_fallback_results(hackathon_name):
    """Fallback URLs for popular hackathons"""
    common_hackathons = {
        'mlh': [{'title': 'Major League Hacking', 'link': 'https://mlh.io', 'snippet': 'Official MLH hackathon platform'}],
        'google cloud': [{'title': 'Google Cloud Hackathon', 'link': 'https://cloud.google.com', 'snippet': 'Google Cloud developer challenges'}],
        'nasa': [{'title': 'NASA Space Apps', 'link': 'https://www.spaceappschallenge.org', 'snippet': 'NASA Space Apps Challenge'}],
        'hackmit': [{'title': 'HackMIT', 'link': 'https://hackmit.org', 'snippet': 'MIT annual hackathon'}],
        'treehacks': [{'title': 'TreeHacks', 'link': 'https://www.treehacks.com', 'snippet': 'Stanford hackathon'}],
        'ethglobal': [{'title': 'ETHGlobal', 'link': 'https://ethglobal.com', 'snippet': 'Ethereum hackathon series'}],
    }
    
    name_lower = hackathon_name.lower()
    for key, results in common_hackathons.items():
        if key in name_lower:
            return {'success': True, 'results': results}
    
    return {'success': True, 'results': [{'title': hackathon_name, 'link': '', 'snippet': 'Hackathon information'}]}


def scrape_hackathon_page(url):
    """
    Scrape hackathon page to extract relevant information (FREE)
    
    Args:
        url (str): URL of the hackathon page
        
    Returns:
        str: Extracted text content from the page
    """
    if not url:
        return ""
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer"]):
                script.decompose()
            
            # Get text content
            text = soup.get_text(separator=' ', strip=True)
            
            # Limit text length
            max_length = 5000
            if len(text) > max_length:
                text = text[:max_length] + "..."
            
            return text
        
        return ""
        
    except Exception as e:
        print(f"Scraping error: {str(e)}")
        return ""


def analyze_with_smart_templates(hackathon_name, web_content, search_snippets):
    """
    FREE intelligent analysis using rule-based patterns and templates
    No paid AI required - uses smart pattern matching!
    
    Args:
        hackathon_name (str): Name of the hackathon
        web_content (str): Scraped content from hackathon page
        search_snippets (list): Search result snippets
        
    Returns:
        dict: Intelligent analysis with professional recommendations
    """
    try:
        # Combine all text for analysis
        all_text = f"{hackathon_name} {' '.join(search_snippets)} {web_content}".lower()
        
        # Detect hackathon type and domain
        domain = detect_domain(all_text)
        
        # Extract technologies mentioned
        technologies = detect_technologies(all_text)
        
        # Generate intelligent summary
        summary = generate_summary(hackathon_name, domain, all_text)
        
        # Extract timeline information
        timeline = extract_timeline(all_text)
        
        # Generate requirements
        requirements = generate_requirements(domain, hackathon_name)
        
        # Get reference projects
        reference_projects = get_reference_projects(technologies, domain)
        
        # Generate tool guides
        tool_guides = generate_tool_guides(technologies)
        
        # Generate practical tips
        tips = generate_practical_tips(domain, hackathon_name)
        
        return {
            'success': True,
            'analysis': {
                'summary': summary,
                'technologies': technologies,
                'timeline': timeline,
                'requirements': requirements,
                'reference_projects': reference_projects,
                'tool_guides': tool_guides,
                'tips': tips
            }
        }
        
    except Exception as e:
        print(f"Analysis error: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }


def detect_domain(text):
    """Detect hackathon domain from text"""
    domains = {
        'AI/ML': ['machine learning', 'ai', 'artificial intelligence', 'neural', 'deep learning', 'ml', 'data science'],
        'Blockchain': ['blockchain', 'ethereum', 'web3', 'crypto', 'defi', 'nft', 'smart contract'],
        'Cloud': ['cloud', 'aws', 'azure', 'gcp', 'google cloud', 'serverless'],
        'Mobile': ['mobile', 'ios', 'android', 'react native', 'flutter', 'app development'],
        'Web Development': ['web', 'frontend', 'backend', 'full stack', 'react', 'node'],
        'IoT': ['iot', 'internet of things', 'embedded', 'arduino', 'raspberry pi'],
        'Space Tech': ['space', 'nasa', 'satellite', 'astronomy'],
        'Social Impact': ['social', 'impact', 'sustainability', 'education', 'healthcare'],
    }
    
    for domain, keywords in domains.items():
        if any(keyword in text for keyword in keywords):
            return domain
    
    return 'General Technology'


def detect_technologies(text):
    """Detect technologies mentioned in text"""
    tech_patterns = {
        'React': {'keywords': ['react', 'reactjs'], 'difficulty': 'Intermediate', 'desc': 'Popular JavaScript library for building user interfaces with component-based architecture'},
        'Node.js': {'keywords': ['node', 'nodejs', 'express'], 'difficulty': 'Intermediate', 'desc': 'JavaScript runtime for building scalable server-side applications'},
        'Python': {'keywords': ['python', 'django', 'flask'], 'difficulty': 'Beginner', 'desc': 'Versatile programming language perfect for rapid prototyping and data processing'},
        'TensorFlow': {'keywords': ['tensorflow', 'tf'], 'difficulty': 'Advanced', 'desc': 'Machine learning framework for building and training neural networks'},
        'Docker': {'keywords': ['docker', 'container'], 'difficulty': 'Intermediate', 'desc': 'Containerization platform for consistent deployment across environments'},
        'MongoDB': {'keywords': ['mongodb', 'mongo'], 'difficulty': 'Beginner', 'desc': 'NoSQL database perfect for flexible, scalable data storage'},
        'PostgreSQL': {'keywords': ['postgres', 'postgresql', 'sql'], 'difficulty': 'Intermediate', 'desc': 'Powerful relational database with advanced features'},
        'AWS': {'keywords': ['aws', 'amazon web'], 'difficulty': 'Intermediate', 'desc': 'Cloud platform offering compute, storage, and ML services'},
        'Firebase': {'keywords': ['firebase'], 'difficulty': 'Beginner', 'desc': 'Backend-as-a-service platform for quick app development'},
        'Git': {'keywords': ['git', 'github'], 'difficulty': 'Beginner', 'desc': 'Version control system essential for team collaboration'},
    }
    
    detected = []
    for tech, info in tech_patterns.items():
        if any(keyword in text for keyword in info['keywords']):
            detected.append({
                'name': tech,
                'description': info['desc'],
                'difficulty': info['difficulty']
            })
    
    # Add default technologies if none detected
    if not detected:
        detected = [
            {'name': 'JavaScript', 'description': 'Essential programming language for web development', 'difficulty': 'Beginner'},
            {'name': 'HTML/CSS', 'description': 'Foundational technologies for creating web interfaces', 'difficulty': 'Beginner'},
            {'name': 'Git', 'description': 'Version control for team collaboration', 'difficulty': 'Beginner'},
        ]
    
    return detected[:6]  # Return top 6


def generate_summary(hackathon_name, domain, text):
    """Generate intelligent summary"""
    templates = {
        'AI/ML': f"{hackathon_name} is a cutting-edge hackathon focused on artificial intelligence and machine learning innovations. Participants will build intelligent applications using modern ML frameworks and data science tools. This event challenges developers to create AI-powered solutions that solve real-world problems.",
        'Blockchain': f"{hackathon_name} brings together blockchain enthusiasts to build decentralized applications and Web3 solutions. Teams will explore smart contracts, DeFi protocols, and innovative crypto applications. This hackathon focuses on building the future of decentralized technology.",
        'Cloud': f"{hackathon_name} challenges participants to build cloud-native applications using modern cloud platforms. Developers will leverage serverless architectures, containerization, and cloud services to create scalable solutions. This event focuses on infrastructure innovation and cloud-first development.",
        'Space Tech': f"{hackathon_name} invites innovators to solve challenges in space technology and exploration. Teams will work with real NASA data and space-related APIs to build applications that advance our understanding of the universe. This hackathon combines technology with the wonder of space.",
        'Social Impact': f"{hackathon_name} focuses on using technology to create positive social change. Participants will build solutions addressing education, healthcare, sustainability, and community challenges. This event empowers developers to make a meaningful impact through innovation.",
    }
    
    return templates.get(domain, f"{hackathon_name} is an exciting hackathon bringing together innovative developers to build creative technology solutions. Participants will collaborate in teams to create impactful projects within a limited timeframe. This event celebrates creativity, technical skill, and problem-solving.")


def extract_timeline(text):
    """Extract timeline from text"""
    # Look for date patterns
    import datetime
    
    timeline = {
        'registration_deadline': 'Check official website',
        'submission_deadline': 'Check official website',
        'current_stage': 'Registration Open'
    }
    
    # Detect common status keywords
    if any(word in text for word in ['ended', 'concluded', 'finished', 'past']):
        timeline['current_stage'] = 'Event Concluded'
    elif any(word in text for word in ['upcoming', 'soon', 'announced']):
        timeline['current_stage'] = 'Upcoming - Registration Opens Soon'
    elif any(word in text for word in ['submission', 'building', 'hacking']):
        timeline['current_stage'] = 'Hacking in Progress'
    
    return timeline


def generate_requirements(domain, hackathon_name):
    """Generate requirements based on domain"""
    base_requirements = [
        'Form a team of 2-4 members (or participate solo if allowed)',
        'Have a GitHub account for code sharing and version control',
        'Bring your laptop with development environment set up',
    ]
    
    domain_requirements = {
        'AI/ML': ['Basic knowledge of Python and machine learning concepts', 'Familiarity with ML frameworks like TensorFlow or PyTorch'],
        'Blockchain': ['Understanding of blockchain fundamentals and smart contracts', 'Wallet setup for testing (MetaMask recommended)'],
        'Cloud': ['Basic cloud platform knowledge (AWS/Azure/GCP)', 'Understanding of containerization concepts'],
        'Mobile': ['Mobile development experience (iOS or Android)', 'Device/emulator for testing'],
        'Web Development': ['Knowledge of HTML, CSS, and JavaScript', 'Familiarity with modern frameworks'],
    }
    
    requirements = base_requirements + domain_requirements.get(domain, ['Enthusiasm to learn and build something amazing!'])
    return requirements[:5]


def get_reference_projects(technologies, domain):
    """Get reference projects based on technologies"""
    projects = [
        {
            'title': 'Awesome Hackathon Projects',
            'description': 'Curated list of impressive hackathon projects with source code and demos',
            'github_url': 'https://github.com/topics/hackathon',
            'relevance': 'Browse winning projects from previous hackathons for inspiration and implementation ideas'
        },
        {
            'title': 'Quick Starter Templates',
            'description': 'Ready-to-use templates for rapid hackathon development',
            'github_url': 'https://github.com/topics/hackathon-starter',
            'relevance': 'Bootstrap your project quickly with pre-configured starter templates'
        },
        {
            'title': f'{technologies[0]["name"] if technologies else "JavaScript"} Example Projects',
            'description': f'Real-world projects showcasing {technologies[0]["name"] if technologies else "JavaScript"} best practices',
            'github_url': f'https://github.com/topics/{technologies[0]["name"].lower().replace(" ", "-") if technologies else "javascript"}',
            'relevance': 'Learn from production-quality code examples and patterns'
        },
    ]
    
    return projects


def generate_tool_guides(technologies):
    """Generate tool guides for technologies"""
    guides = []
    
    for tech in technologies[:3]:  # Top 3 technologies
        guide = {
            'tool_name': tech['name'],
            'quick_start': f"Get started with {tech['name']} by installing the required dependencies and following the official quick-start guide. Set up your development environment and create a simple 'Hello World' project to verify everything works.",
            'key_resources': [
                f"Official {tech['name']} Documentation",
                f"{tech['name']} Tutorial for Beginners",
                f"Community forums and Stack Overflow for troubleshooting"
            ],
            'hackathon_context': f"For the hackathon, focus on using {tech['name']} to build your core features quickly. Prioritize functionality over perfection, and leverage existing libraries and frameworks to save time."
        }
        guides.append(guide)
    
    return guides


def generate_practical_tips(domain, hackathon_name):
    """Generate practical tips"""
    general_tips = [
        'Start with the simplest viable product (MVP) - you can always add features later',
        'Spend the first hour planning your architecture and dividing tasks among team members',
        'Use version control (Git) from the start to avoid conflicts and enable collaboration',
        'Test your demo thoroughly before presentation time - practice makes perfect',
        'Focus on solving one problem really well rather than many problems poorly',
        'Keep your presentation simple and focused on the problem, solution, and impact',
        'Don\'t forget to document your code - future you (and judges) will appreciate it',
    ]
    
    domain_tips = {
        'AI/ML': ['Use pre-trained models to save time - don\'t train from scratch unless necessary', 'Have a simple demo dataset ready to showcase your model\'s capabilities'],
        'Blockchain': ['Start with testnets to avoid real money transactions during development', 'Use established patterns and audited contracts as starting points'],
        'Cloud': ['Leverage free tier credits from cloud providers for the hackathon', 'Use Infrastructure-as-Code to make deployment repeatable'],
    }
    
    tips = general_tips[:5] + domain_tips.get(domain, [])
    return tips[:7]


@app.route('/api/analyze-hackathon', methods=['POST'])
def analyze_hackathon():
    """
    Main endpoint to analyze a hackathon (FREE VERSION - No paid APIs!)
    
    Expected JSON body:
    {
        "hackathon_name": "Name of the hackathon"
    }
    
    Returns:
    {
        "success": true/false,
        "data": { ... analyzed data ... },
        "error": "error message if any"
    }
    """
    try:
        data = request.get_json()
        hackathon_name = data.get('hackathon_name')
        
        if not hackathon_name:
            return jsonify({
                'success': False,
                'error': 'Hackathon name is required'
            }), 400
        
        print(f"✨ Analyzing hackathon: {hackathon_name} (FREE VERSION)")
        
        # Step 1: Search for hackathon page (FREE - DuckDuckGo HTML)
        print("Step 1: Searching web (FREE)...")
        search_result = search_hackathon_page(hackathon_name)
        
        if not search_result['success']:
            return jsonify({
                'success': False,
                'error': 'Failed to find hackathon information online'
            }), 404
        
        search_results = search_result['results']
        
        # Step 2: Scrape the top result (FREE - BeautifulSoup)
        print("Step 2: Scraping hackathon page (FREE)...")
        web_content = ""
        if search_results:
            top_url = search_results[0]['link']
            web_content = scrape_hackathon_page(top_url)
        
        # Step 3: Analyze with smart templates (FREE - No AI cost!)
        print("Step 3: Analyzing with smart templates (FREE)...")
        snippets = [r['snippet'] for r in search_results]
        analysis_result = analyze_with_smart_templates(hackathon_name, web_content, snippets)
        
        if not analysis_result['success']:
            return jsonify({
                'success': False,
                'error': 'Failed to analyze hackathon'
            }), 500
        
        # Step 4: Return comprehensive response
        response_data = {
            'success': True,
            'data': {
                'hackathon_name': hackathon_name,
                'source_url': search_results[0]['link'] if search_results else None,
                'analyzed_at': time.strftime('%Y-%m-%d %H:%M:%S'),
                **analysis_result['analysis']
            }
        }
        
        print("✅ Analysis complete (100% FREE)!")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ Error in analyze_hackathon: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Smart Hackathon Analyzer (FREE)',
        'version': '2.0.0-free',
        'cost': '$0.00 - Completely Free!'
    }), 200


if __name__ == '__main__':
    print("=" * 60)
    print("🎉 FREE PROTOTYPE VERSION - NO API KEYS NEEDED!")
    print("=" * 60)
    print("✅ 100% Free - No paid APIs")
    print("✅ Smart template-based analysis")
    print("✅ Web scraping powered")
    print("✅ Professional quality results")
    print("=" * 60)
    print("\n🚀 Starting Flask server...")
    print("📍 Server: http://localhost:5000")
    print("💚 Cost: $0.00 (FREE!)\n")
    
    app.run(debug=True, port=5000)
