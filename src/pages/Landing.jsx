import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  ArrowRight, Code2, Sparkles, Globe, Users, Zap, 
  Play, GitFork, Share2, Lock, Palette, Terminal,
  ChevronRight, Github, Twitter, Linkedin, Menu, X
} from 'lucide-react'
import bumuoLogo from '../assets/bumuo-logo.png'
import globeGrid from '../assets/globe-grid.png'

export const Landing = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [activeTab, setActiveTab] = useState('html')
  const [magicActive, setMagicActive] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [globeVisible, setGlobeVisible] = useState(false)
  const [orbitAngle, setOrbitAngle] = useState(0)
  const heroRef = useRef(null)
  const communityRef = useRef(null)
  const orbitAnimationRef = useRef(null)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  // Handle scroll for navbar effect and globe visibility
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      // Check if community section is in view for globe animation
      if (communityRef.current) {
        const rect = communityRef.current.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.75
        if (isVisible && !globeVisible) {
          setGlobeVisible(true)
        }
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [globeVisible])

  // Orbital animation - Saturn ring style
  useEffect(() => {
    if (!globeVisible) return
    
    const animate = () => {
      setOrbitAngle(prev => (prev + 0.3) % 360)
      orbitAnimationRef.current = requestAnimationFrame(animate)
    }
    
    // Start animation after globe fades in
    const startDelay = setTimeout(() => {
      orbitAnimationRef.current = requestAnimationFrame(animate)
    }, 800)
    
    return () => {
      clearTimeout(startDelay)
      if (orbitAnimationRef.current) {
        cancelAnimationFrame(orbitAnimationRef.current)
      }
    }
  }, [globeVisible])

  // Calculate orbital position for each card (Saturn ring effect)
  const getOrbitalPosition = (cardIndex, totalCards) => {
    const baseAngle = (cardIndex / totalCards) * 360
    const angle = (baseAngle + orbitAngle) * (Math.PI / 180)
    
    // Elliptical orbit parameters
    const radiusX = 220  // Horizontal radius
    const radiusZ = 180  // Depth radius (creates ellipse)
    const tiltAngle = 35 * (Math.PI / 180)  // 35 degree tilt for Saturn-like ring
    
    // Calculate position on tilted ellipse
    const x = Math.cos(angle) * radiusX
    const z = Math.sin(angle) * radiusZ
    
    // Apply tilt - this creates the "higher back, lower front" effect
    const tiltedY = z * Math.sin(tiltAngle)
    const tiltedZ = z * Math.cos(tiltAngle)
    
    // Calculate visual scale based on depth (farther = smaller)
    const depthScale = 0.75 + (tiltedZ + radiusZ) / (radiusZ * 4)
    
    // Calculate opacity - cards in back are slightly dimmer
    const opacity = 0.6 + (tiltedZ + radiusZ) / (radiusZ * 2.5)
    
    // Z-index: positive z = in front, negative z = behind
    const zIndex = tiltedZ > 0 ? 60 : 40
    
    return {
      transform: `translate3d(${x}px, ${tiltedY}px, ${tiltedZ}px) scale(${depthScale})`,
      opacity: Math.min(1, opacity),
      zIndex,
    }
  }

  // Creator cards data
  const creatorCards = [
    { initials: 'JD', name: 'John Doe', time: '2 hours ago', project: 'Animated Portfolio', forks: 24, likes: 156, gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
    { initials: 'SK', name: 'Sarah Kim', time: 'Yesterday', project: 'Interactive Dashboard', forks: 42, likes: 289, gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)' },
    { initials: 'AC', name: 'Alex Chen', time: '3 days ago', project: '3D Landing Page', forks: 67, likes: 412, gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
    { initials: 'MP', name: 'Maya Patel', time: '1 week ago', project: 'AI Chat Interface', forks: 89, likes: 534, gradient: 'linear-gradient(135deg, #10b981, #06b6d4)' },
  ]

  // Code typing animation for hero
  const codeLines = [
    { text: '// Your ideas, beautifully coded', delay: 0 },
    { text: 'const project = await bumuo.create();', delay: 1500 },
    { text: 'project.preview(); // Live preview ✨', delay: 3500 },
  ]

  useEffect(() => {
    if (currentLine < codeLines.length) {
      const line = codeLines[currentLine].text
      if (currentChar < line.length) {
        const timer = setTimeout(() => {
          setCurrentChar(prev => prev + 1)
        }, 40 + Math.random() * 20)
        return () => clearTimeout(timer)
      } else {
        const timer = setTimeout(() => {
          setCurrentLine(prev => prev + 1)
          setCurrentChar(0)
        }, 800)
        return () => clearTimeout(timer)
      }
    } else {
      // Reset animation
      const timer = setTimeout(() => {
        setCurrentLine(0)
        setCurrentChar(0)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [currentLine, currentChar])

  const features = [
    {
      icon: <Code2 size={24} />,
      title: 'Real-time Code Editor',
      description: 'Write HTML, CSS, and JavaScript with intelligent syntax highlighting and instant error detection.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Play size={24} />,
      title: 'Live Preview',
      description: 'See your changes instantly with our blazing-fast hot-reload preview pane.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: <Globe size={24} />,
      title: 'Share Anywhere',
      description: 'Generate public links to share your creations with the world in one click.',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: <GitFork size={24} />,
      title: 'Fork & Learn',
      description: 'Explore community projects, fork them, and learn from other developers.',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      icon: <Lock size={24} />,
      title: 'Privacy Controls',
      description: 'Keep your projects private or share them publicly. You\'re in complete control.',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: <Zap size={24} />,
      title: 'Lightning Fast',
      description: 'Built for performance. No lag, no waiting. Just pure coding flow.',
      gradient: 'from-yellow-500 to-orange-500',
    },
  ]

  const stats = [
    { value: '10K+', label: 'Lines of Code Written' },
    { value: '500+', label: 'Projects Created' },
    { value: '100+', label: 'Happy Developers' },
    { value: '99.9%', label: 'Uptime' },
  ]

  return (
    <div style={pageStyle}>
      {/* Animated Background */}
      <div style={backgroundStyle}>
        <div style={gridOverlayStyle} />
        <div style={gradientOrbStyle} />
        <div style={gradientOrb2Style} />
      </div>

      {/* Floating Code Particles */}
      <div style={particlesContainerStyle}>
        {['</', '/>', '{}', '()', '[]', '=>', '&&', '||'].map((symbol, i) => (
          <div 
            key={i} 
            style={{
              ...particleStyle,
              left: `${10 + i * 12}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${15 + i * 2}s`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav style={{
        ...navStyle,
        background: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
      }}>
        <div style={navContainerStyle}>
          <div style={navInnerStyle}>
            {/* Logo */}
            <Link to="/" style={logoStyle}>
              <img 
                src={bumuoLogo} 
                alt="BumuO" 
                style={{ width: '40px', height: '40px', borderRadius: '10px' }} 
              />
              <span style={logoTextStyle}>BumuO</span>
            </Link>

            {/* Desktop Nav Links */}
            <div style={navLinksStyle}>
              <a href="#features" style={navLinkStyle}>Features</a>
              <a href="#showcase" style={navLinkStyle}>Showcase</a>
              <Link to="/community" style={navLinkStyle}>Community</Link>
            </div>

            {/* Auth Buttons */}
            <div style={authButtonsStyle}>
              <Link to="/login" style={loginButtonStyle}>
                Sign In
              </Link>
              <Link to="/register" style={signupButtonStyle}>
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={mobileMenuBtnStyle}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div style={mobileMenuStyle}>
              <a href="#features" style={mobileNavLinkStyle} onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#showcase" style={mobileNavLinkStyle} onClick={() => setMobileMenuOpen(false)}>Showcase</a>
              <Link to="/community" style={mobileNavLinkStyle} onClick={() => setMobileMenuOpen(false)}>Community</Link>
              <div style={mobileDividerStyle} />
              <Link to="/login" style={mobileNavLinkStyle} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              <Link to="/register" style={mobileSignupBtnStyle} onClick={() => setMobileMenuOpen(false)}>
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={heroStyle} ref={heroRef}>
        <div style={heroContainerStyle}>
          {/* Badge */}
          <div style={heroBadgeStyle}>
            <span style={badgeIconStyle}>{'</>'}</span>
            <span>Where code comes alive</span>
            <span style={badgeDotStyle} />
          </div>

          {/* Main Heading */}
          <h1 style={heroHeadingStyle}>
            Build. Preview.
            <br />
            <span style={heroGradientTextStyle}>Share Instantly.</span>
          </h1>

          {/* Subheading */}
          <p style={heroSubheadingStyle}>
            BumuO is a powerful, real-time code editor for HTML, CSS, and JavaScript.
            Create beautiful projects, preview them live, and share with the world.
          </p>

          {/* CTA Buttons */}
          <div style={heroCTAStyle}>
            <Link to="/register" style={primaryCTAStyle}>
              Start Creating Free
              <ArrowRight size={18} />
            </Link>
            <a href="#showcase" style={secondaryCTAStyle}>
              <Play size={18} style={{ marginRight: '8px' }} />
              See It In Action
            </a>
          </div>

          {/* Hero Terminal */}
          <div style={heroTerminalStyle}>
            <div style={terminalHeaderStyle}>
              <div style={terminalDotsStyle}>
                <span style={{ ...dotStyle, background: '#ff5f56' }} />
                <span style={{ ...dotStyle, background: '#ffbd2e' }} />
                <span style={{ ...dotStyle, background: '#27ca3f' }} />
              </div>
              <span style={terminalTitleStyle}>bumuo — editor</span>
            </div>
            <div style={terminalBodyStyle}>
              {codeLines.slice(0, currentLine + 1).map((line, idx) => (
                <div key={idx} style={terminalLineStyle}>
                  <span style={lineNumberStyle}>{idx + 1}</span>
                  <span style={idx === 0 ? commentStyle : codeStyle}>
                    {idx === currentLine 
                      ? line.text.substring(0, currentChar)
                      : line.text
                    }
                  </span>
                  {idx === currentLine && <span style={cursorStyle}>|</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div style={scrollIndicatorStyle}>
          <div style={scrollMouseStyle}>
            <div style={scrollWheelStyle} />
          </div>
          <span style={scrollTextStyle}>Scroll to explore</span>
        </div>
      </section>

      {/* Spacer to prevent overlap */}
      <div style={{ height: '40px' }} />

      {/* Stats Section */}
      <section style={statsStyle}>
        <div style={statsContainerStyle}>
          {stats.map((stat, idx) => (
            <div key={idx} style={statItemStyle}>
              <span style={statValueStyle}>{stat.value}</span>
              <span style={statLabelStyle}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={featuresStyle}>
        <div style={featuresContainerStyle}>
          <div style={sectionHeaderStyle}>
            <span style={sectionTagStyle}>Features</span>
            <h2 style={sectionTitleStyle}>Everything you need to code</h2>
            <p style={sectionDescStyle}>
              Powerful features designed for developers who want to build, learn, and share.
            </p>
          </div>

          <div style={featuresGridStyle}>
            {features.map((feature, idx) => (
              <div key={idx} style={featureCardStyle} className="feature-card">
                <div style={{
                  ...featureIconStyle,
                  background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]}, ${feature.gradient.split(' ')[3]})`,
                }}>
                  {feature.icon}
                </div>
                <h3 style={featureTitleStyle}>{feature.title}</h3>
                <p style={featureDescStyle}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" style={showcaseStyle}>
        <div style={showcaseContainerStyle}>
          <div style={sectionHeaderStyle}>
            <span style={sectionTagStyle}>Showcase</span>
            <h2 style={sectionTitleStyle}>See BumuO in action</h2>
            <p style={sectionDescStyle}>
              Experience the seamless workflow of building and previewing in real-time.
            </p>
          </div>

          <div style={showcasePreviewStyle}>
            <div style={showcaseEditorStyle} className="showcase-grid">
              {/* Editor Panel */}
              <div style={editorPanelStyle}>
                <div style={editorTabsStyle} className="editor-tabs">
                  <button 
                    onClick={() => setActiveTab('html')}
                    style={activeTab === 'html' ? editorTabActiveStyle : editorTabStyle}
                  >
                    index.html
                  </button>
                  <button 
                    onClick={() => setActiveTab('css')}
                    style={activeTab === 'css' ? editorTabActiveStyle : editorTabStyle}
                  >
                    style.css
                  </button>
                  <button 
                    onClick={() => setActiveTab('js')}
                    style={activeTab === 'js' ? editorTabActiveStyle : editorTabStyle}
                  >
                    script.js
                  </button>
                </div>
                <div style={editorCodeStyle}>
                  <pre style={codeBlockStyle}>
{activeTab === 'html' ? `<!DOCTYPE html>
<html lang="en">
<head>
  <title>My Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1 id="title">Hello, BumuO! 👋</h1>
    <p>Start building amazing things.</p>
    <button id="magic-btn">
      Click for magic ✨
    </button>
    <div id="particles"></div>
  </div>
  <script src="script.js"></script>
</body>
</html>` : activeTab === 'css' ? `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
}

h1 {
  font-size: 2.5rem;
  color: #1e1e2e;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

h1.rainbow {
  background: linear-gradient(90deg, #ff6b6b, #feca57, 
    #48dbfb, #ff9ff3, #54a0ff);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: rainbow 2s ease infinite;
}

p {
  color: #6b7280;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

#magic-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

#magic-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
}

@keyframes rainbow {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}` : `const btn = document.getElementById('magic-btn');
const title = document.getElementById('title');
let clickCount = 0;

const messages = [
  "Hello, BumuO! 👋",
  "You clicked! 🎉",
  "Keep going! 🚀",
  "You're amazing! ⭐",
  "Code is poetry 💻",
  "console.log('🔥')",
  "while(true) { learn() }",
  "git commit -m 'magic'",
];

const createParticle = (x, y) => {
  const particle = document.createElement('span');
  particle.innerHTML = ['✨', '🎉', '💫', '⭐', '🚀'][
    Math.floor(Math.random() * 5)
  ];
  particle.style.cssText = \`
    position: fixed;
    pointer-events: none;
    font-size: 24px;
    left: \${x}px;
    top: \${y}px;
    animation: float 1s ease-out forwards;
  \`;
  document.body.appendChild(particle);
  setTimeout(() => particle.remove(), 1000);
};

btn.addEventListener('click', (e) => {
  clickCount++;
  title.textContent = messages[clickCount % messages.length];
  title.classList.add('rainbow');
  
  // Create burst of particles
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      createParticle(
        e.clientX + (Math.random() - 0.5) * 100,
        e.clientY + (Math.random() - 0.5) * 100
      );
    }, i * 50);
  }
});`}
                  </pre>
                </div>
              </div>

              {/* Preview Panel */}
              <div style={previewPanelStyle}>
                <div style={previewHeaderStyle}>
                  <span style={previewDotStyle} />
                  <span style={previewUrlStyle}>preview.bumuo.dev</span>
                </div>
                <div style={{
                  ...previewContentStyle,
                  background: magicActive 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#ffffff',
                }}>
                  <h1 style={{
                    ...previewH1Style,
                    ...(magicActive ? {
                      background: 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)',
                      backgroundSize: '400% 400%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'rainbow-text 2s ease infinite',
                    } : {}),
                  }}>
                    {magicActive 
                      ? ['Hello, BumuO! 👋', 'You clicked! 🎉', 'Keep going! 🚀', 'You\'re amazing! ⭐', 'Code is poetry 💻', 'console.log(\'🔥\')', 'while(true) { learn() }', 'git commit -m \'magic\''][clickCount % 8]
                      : 'Hello, BumuO! 👋'
                    }
                  </h1>
                  <p style={{
                    ...previewPStyle,
                    color: magicActive ? 'rgba(255,255,255,0.8)' : '#6b7280',
                  }}>Start building amazing things.</p>
                  <button 
                    style={{
                      ...previewButtonStyle,
                      transform: magicActive ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onClick={() => {
                      setMagicActive(true)
                      setClickCount(prev => prev + 1)
                    }}
                  >
                    Click for magic ✨
                  </button>
                  {magicActive && (
                    <div style={particleContainerStyle}>
                      {[...Array(12)].map((_, i) => (
                        <span 
                          key={`${clickCount}-${i}`} 
                          style={{
                            ...floatingParticleStyle,
                            left: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        >
                          {['✨', '🎉', '💫', '⭐', '🚀', '💻'][i % 6]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" style={communityStyle} ref={communityRef}>
        <div style={communityContainerStyle}>
          <div style={communityContentStyle}>
            <span style={sectionTagStyle}>Community</span>
            <h2 style={communityTitleStyle}>Join thousands of creators</h2>
            <p style={communityDescStyle}>
              Explore projects from our community, fork and learn from others, 
              or share your own creations with the world.
            </p>
            <div style={communityFeaturesStyle}>
              <div style={communityFeatureStyle}>
                <Users size={20} style={{ color: '#60a5fa' }} />
                <span>Discover inspiring projects</span>
              </div>
              <div style={communityFeatureStyle}>
                <GitFork size={20} style={{ color: '#34d399' }} />
                <span>Fork and customize</span>
              </div>
              <div style={communityFeatureStyle}>
                <Share2 size={20} style={{ color: '#a78bfa' }} />
                <span>Share your work</span>
              </div>
            </div>
            <Link to="/register" style={communityCTAStyle}>
              Join the Community
              <ArrowRight size={18} />
            </Link>
          </div>
          
          {/* Orbital Globe Visual */}
          <div style={communityVisualStyle}>
            {/* 3D Orbital Container */}
            <div style={orbitalContainerStyle}>
              {/* Orbital Ring - Back Layer (behind globe) */}
              <div style={{
                ...orbitalRingBackStyle,
                opacity: globeVisible ? 0.4 : 0,
              }} />
              
              {/* Globe Image - Center */}
              <div style={{
                ...globeWrapperStyle,
                opacity: globeVisible ? 1 : 0,
                transform: globeVisible ? 'scale(1)' : 'scale(0.8)',
              }}>
                <img 
                  src={globeGrid} 
                  alt="Global Community" 
                  style={globeImageStyle}
                />
                <div style={globeGlowStyle} />
                <div style={globeInnerGlowStyle} />
              </div>
              
              {/* Orbital Ring - Front Layer (in front of globe, clipped) */}
              <div style={{
                ...orbitalRingFrontStyle,
                opacity: globeVisible ? 0.5 : 0,
              }} />
              
              {/* Orbiting Cards - Each positioned via JS */}
              {creatorCards.map((card, index) => {
                const position = getOrbitalPosition(index, creatorCards.length)
                return (
                  <div 
                    key={card.initials}
                    style={{
                      ...orbitingCardWrapperStyle,
                      ...position,
                      opacity: globeVisible ? position.opacity : 0,
                      transition: globeVisible ? 'opacity 0.3s ease' : 'opacity 0.8s ease',
                    }}
                  >
                    <div style={communityCardStyle}>
                      <div style={communityCardHeaderStyle}>
                        <div style={{ ...avatarStyle, background: card.gradient }}>{card.initials}</div>
                        <div>
                          <div style={cardAuthorStyle}>{card.name}</div>
                          <div style={cardDateStyle}>{card.time}</div>
                        </div>
                      </div>
                      <h4 style={cardTitleStyle}>{card.project}</h4>
                      <div style={cardStatsStyle}>
                        <span><GitFork size={14} /> {card.forks} forks</span>
                        <span><Sparkles size={14} /> {card.likes} likes</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {/* Particle effects around orbit */}
              {globeVisible && (
                <div style={orbitParticlesStyle}>
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i}
                      style={{
                        ...orbitParticleStyle,
                        animationDelay: `${i * 0.5}s`,
                        left: `${20 + i * 10}%`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={ctaSectionStyle}>
        <div style={ctaContainerStyle}>
          <div style={ctaGlowStyle} />
          <h2 style={ctaTitleStyle}>Ready to start building?</h2>
          <p style={ctaDescStyle}>
            Join BumuO today and bring your ideas to life. No credit card required.
          </p>
          <Link to="/register" style={ctaButtonStyle}>
            Create Your Free Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={footerStyle}>
        <div style={footerContainerStyle}>
          <div style={footerMainStyle}>
            <div style={footerBrandStyle}>
              <div style={footerLogoStyle}>
                <img 
                  src={bumuoLogo} 
                  alt="BumuO" 
                  style={{ width: '36px', height: '36px', borderRadius: '8px' }} 
                />
                <span style={footerLogoTextStyle}>BumuO</span>
              </div>
              <p style={footerTaglineStyle}>
                The modern coding sandbox for creators.
                Build, preview, and share your code instantly.
              </p>
            </div>

            <div style={footerLinksStyle}>
              <div style={footerColumnStyle}>
                <h4 style={footerColumnTitleStyle}>Product</h4>
                <a href="#features" style={footerLinkStyle}>Features</a>
                <a href="#showcase" style={footerLinkStyle}>Showcase</a>
                <a href="#community" style={footerLinkStyle}>Community</a>
              </div>
              <div style={footerColumnStyle}>
                <h4 style={footerColumnTitleStyle}>Resources</h4>
                <a href="#" style={footerLinkStyle}>Documentation</a>
                <a href="#" style={footerLinkStyle}>Tutorials</a>
                <a href="#" style={footerLinkStyle}>Blog</a>
              </div>
              <div style={footerColumnStyle}>
                <h4 style={footerColumnTitleStyle}>Company</h4>
                <a href="#" style={footerLinkStyle}>About Us</a>
                <a href="#" style={footerLinkStyle}>Contact</a>
                <a href="#" style={footerLinkStyle}>Privacy Policy</a>
              </div>
            </div>
          </div>

          <div style={footerBottomStyle}>
            <p style={footerCopyrightStyle}>
              © 2026 BumuO. All rights reserved.
            </p>
            <div style={footerSocialStyle}>
              <a href="#" style={socialLinkStyle}><Github size={20} /></a>
              <a href="#" style={socialLinkStyle}><Twitter size={20} /></a>
              <a href="#" style={socialLinkStyle}><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
      </footer>

      {/* Inject animations */}
      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 0.1; }
          90% { opacity: 0.1; }
          100% {
            transform: translateY(-100px) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        
        @keyframes scroll-wheel {
          0% { 
            transform: translateY(0); 
            opacity: 1;
          }
          50% { 
            transform: translateY(12px); 
            opacity: 0.3;
          }
          100% { 
            transform: translateY(0); 
            opacity: 1;
          }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes rainbow-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-up-particle {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) scale(0.5) rotate(180deg);
            opacity: 0;
          }
        }
        
        /* Orbit sparkle particles */
        @keyframes orbit-sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 0.8;
            transform: scale(1);
          }
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(59, 130, 246, 0.1);
        }
        
        /* Hide scrollbar for editor tabs */
        .editor-tabs::-webkit-scrollbar {
          display: none;
        }
        
        @media (max-width: 900px) {
          .showcase-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  )
}

// ============================================
// STYLES
// ============================================

const pageStyle = {
  minHeight: '100vh',
  backgroundColor: '#0a0a0f',
  color: '#e4e4eb',
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  position: 'relative',
  overflow: 'hidden',
}

const backgroundStyle = {
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
}

const gridOverlayStyle = {
  position: 'absolute',
  inset: 0,
  backgroundImage: `
    linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
  `,
  backgroundSize: '60px 60px',
  animation: 'grid-move 30s linear infinite',
}

const gradientOrbStyle = {
  position: 'absolute',
  top: '-20%',
  right: '-10%',
  width: '800px',
  height: '800px',
  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
  filter: 'blur(60px)',
  animation: 'pulse-glow 8s ease-in-out infinite',
}

const gradientOrb2Style = {
  position: 'absolute',
  bottom: '-30%',
  left: '-15%',
  width: '600px',
  height: '600px',
  background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
  filter: 'blur(60px)',
  animation: 'pulse-glow 10s ease-in-out infinite 2s',
}

const particlesContainerStyle = {
  position: 'fixed',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 1,
}

const particleStyle = {
  position: 'absolute',
  fontSize: '20px',
  fontFamily: "'Fira Code', monospace",
  color: 'rgba(59, 130, 246, 0.08)',
  animation: 'float-particle 20s linear infinite',
  bottom: '-50px',
}

// Navigation
const navStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  transition: 'all 0.3s ease',
}

const navContainerStyle = {
  maxWidth: '1280px',
  margin: '0 auto',
  padding: '0 24px',
}

const navInnerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '72px',
}

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  textDecoration: 'none',
  color: '#ffffff',
}

const logoTextStyle = {
  fontSize: '22px',
  fontWeight: 700,
  letterSpacing: '-0.025em',
}

const navLinksStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '32px',
}

const navLinkStyle = {
  color: 'rgba(255, 255, 255, 0.7)',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 500,
  transition: 'color 0.2s ease',
}

const authButtonsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const loginButtonStyle = {
  padding: '10px 20px',
  color: 'rgba(255, 255, 255, 0.8)',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 500,
  borderRadius: '10px',
  transition: 'all 0.2s ease',
}

const signupButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: 600,
  borderRadius: '10px',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
}

const mobileMenuBtnStyle = {
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px',
  background: 'transparent',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.8)',
  cursor: 'pointer',
  borderRadius: '10px',
}

const mobileMenuStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '16px 0 24px',
  animation: 'fade-up 0.3s ease',
}

const mobileNavLinkStyle = {
  padding: '14px 16px',
  color: 'rgba(255, 255, 255, 0.8)',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 500,
  borderRadius: '10px',
  transition: 'all 0.2s ease',
}

const mobileDividerStyle = {
  height: '1px',
  background: 'rgba(255, 255, 255, 0.1)',
  margin: '8px 0',
}

const mobileSignupBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '14px 16px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 600,
  borderRadius: '10px',
  marginTop: '8px',
}

// Hero Section
const heroStyle = {
  position: 'relative',
  minHeight: 'calc(100vh - 72px)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '100px 24px 60px',
  zIndex: 10,
}

const heroContainerStyle = {
  maxWidth: '1000px',
  textAlign: 'center',
}

const heroBadgeStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 18px',
  background: 'rgba(59, 130, 246, 0.08)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '100px',
  fontSize: '14px',
  fontWeight: 500,
  color: '#60a5fa',
  marginBottom: '32px',
}

const badgeIconStyle = {
  fontFamily: "'Fira Code', monospace",
  fontSize: '12px',
  fontWeight: 600,
  color: '#a78bfa',
  background: 'rgba(167, 139, 250, 0.15)',
  padding: '4px 8px',
  borderRadius: '6px',
}

const badgeDotStyle = {
  width: '6px',
  height: '6px',
  background: '#34d399',
  borderRadius: '50%',
  animation: 'pulse-dot 2s ease-in-out infinite',
}

const heroHeadingStyle = {
  fontSize: 'clamp(40px, 8vw, 72px)',
  fontWeight: 800,
  lineHeight: 1.1,
  letterSpacing: '-0.03em',
  color: '#ffffff',
  marginBottom: '24px',
}

const heroGradientTextStyle = {
  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const heroSubheadingStyle = {
  fontSize: 'clamp(16px, 2.5vw, 20px)',
  color: 'rgba(255, 255, 255, 0.6)',
  maxWidth: '640px',
  margin: '0 auto 40px',
  lineHeight: 1.6,
}

const heroCTAStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  flexWrap: 'wrap',
  marginBottom: '60px',
}

const primaryCTAStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '17px',
  fontWeight: 600,
  borderRadius: '14px',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 30px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
}

const secondaryCTAStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '16px 28px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '17px',
  fontWeight: 500,
  borderRadius: '14px',
  transition: 'all 0.3s ease',
}

// Hero Terminal
const heroTerminalStyle = {
  background: 'rgba(30, 30, 46, 0.8)',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  maxWidth: '580px',
  margin: '0 auto',
  textAlign: 'left',
  backdropFilter: 'blur(20px)',
}

const terminalHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  background: 'rgba(22, 22, 34, 0.8)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
}

const terminalDotsStyle = {
  display: 'flex',
  gap: '8px',
}

const dotStyle = {
  width: '12px',
  height: '12px',
  borderRadius: '50%',
}

const terminalTitleStyle = {
  flex: 1,
  textAlign: 'center',
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.4)',
  fontWeight: 500,
  marginRight: '60px',
}

const terminalBodyStyle = {
  padding: '20px 24px',
  fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
  fontSize: '14px',
  lineHeight: 2,
  minHeight: '120px',
}

const terminalLineStyle = {
  display: 'flex',
  alignItems: 'center',
}

const lineNumberStyle = {
  width: '30px',
  color: 'rgba(255, 255, 255, 0.2)',
  fontSize: '12px',
  userSelect: 'none',
  textAlign: 'right',
  paddingRight: '16px',
}

const commentStyle = {
  color: '#5c6370',
  fontStyle: 'italic',
}

const codeStyle = {
  color: '#abb2bf',
}

const cursorStyle = {
  display: 'inline-block',
  color: '#61afef',
  animation: 'blink 1s step-end infinite',
  fontWeight: 300,
  marginLeft: '2px',
}

const scrollIndicatorStyle = {
  position: 'relative',
  marginTop: '60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
}

const scrollMouseStyle = {
  width: '26px',
  height: '42px',
  border: '2px solid rgba(255, 255, 255, 0.25)',
  borderRadius: '13px',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: '8px',
  background: 'rgba(255, 255, 255, 0.03)',
}

const scrollWheelStyle = {
  width: '4px',
  height: '10px',
  background: 'rgba(255, 255, 255, 0.5)',
  borderRadius: '4px',
  animation: 'scroll-wheel 1.8s ease-in-out infinite',
}

const scrollTextStyle = {
  fontSize: '12px',
  color: 'rgba(255, 255, 255, 0.3)',
  fontWeight: 500,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
}

// Stats Section
const statsStyle = {
  position: 'relative',
  padding: '60px 24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  background: 'rgba(15, 15, 23, 0.5)',
  zIndex: 10,
}

const statsContainerStyle = {
  maxWidth: '1000px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '40px',
  textAlign: 'center',
}

const statItemStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
}

const statValueStyle = {
  fontSize: '40px',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
}

const statLabelStyle = {
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.5)',
  fontWeight: 500,
}

// Features Section
const featuresStyle = {
  position: 'relative',
  padding: '120px 24px',
  zIndex: 10,
}

const featuresContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
}

const sectionHeaderStyle = {
  textAlign: 'center',
  marginBottom: '64px',
}

const sectionTagStyle = {
  display: 'inline-block',
  padding: '6px 14px',
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '100px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#60a5fa',
  marginBottom: '20px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const sectionTitleStyle = {
  fontSize: 'clamp(28px, 5vw, 44px)',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: '#ffffff',
  marginBottom: '16px',
}

const sectionDescStyle = {
  fontSize: '18px',
  color: 'rgba(255, 255, 255, 0.5)',
  maxWidth: '560px',
  margin: '0 auto',
}

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '24px',
}

const featureCardStyle = {
  padding: '32px',
  background: 'rgba(30, 30, 46, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '20px',
  transition: 'all 0.3s ease',
  cursor: 'default',
}

const featureIconStyle = {
  width: '52px',
  height: '52px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '14px',
  marginBottom: '20px',
  color: '#ffffff',
}

const featureTitleStyle = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: '12px',
}

const featureDescStyle = {
  fontSize: '15px',
  color: 'rgba(255, 255, 255, 0.5)',
  lineHeight: 1.6,
}

// Showcase Section
const showcaseStyle = {
  position: 'relative',
  padding: '120px 24px',
  background: 'rgba(15, 15, 23, 0.5)',
  zIndex: 10,
}

const showcaseContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
}

const showcasePreviewStyle = {
  marginTop: '48px',
}

const showcaseEditorStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  background: 'rgba(22, 22, 34, 0.8)',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  boxShadow: '0 25px 80px rgba(0, 0, 0, 0.4)',
  minHeight: '500px',
}

const editorPanelStyle = {
  borderRight: '1px solid rgba(255, 255, 255, 0.06)',
  display: 'flex',
  flexDirection: 'column',
}

const editorTabsStyle = {
  display: 'flex',
  gap: '4px',
  padding: '12px 16px',
  background: 'rgba(15, 15, 23, 0.8)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  WebkitOverflowScrolling: 'touch',
  flexWrap: 'nowrap',
}

const editorTabActiveStyle = {
  padding: '8px 16px',
  background: 'rgba(59, 130, 246, 0.2)',
  color: '#60a5fa',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 500,
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  flexShrink: 0,
  whiteSpace: 'nowrap',
}

const editorTabStyle = {
  padding: '8px 16px',
  color: 'rgba(255, 255, 255, 0.4)',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 500,
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  flexShrink: 0,
  whiteSpace: 'nowrap',
}

const editorCodeStyle = {
  padding: '20px',
  overflow: 'auto',
  flex: 1,
  maxHeight: '450px',
}

const codeBlockStyle = {
  fontFamily: "'Fira Code', monospace",
  fontSize: '13px',
  lineHeight: 1.7,
  color: '#abb2bf',
  margin: 0,
}

const previewPanelStyle = {
  padding: '0',
  display: 'flex',
  flexDirection: 'column',
}

const previewHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 20px',
  background: 'rgba(15, 15, 23, 0.8)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
}

const previewDotStyle = {
  width: '10px',
  height: '10px',
  background: '#34d399',
  borderRadius: '50%',
}

const previewUrlStyle = {
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.4)',
}

const previewContentStyle = {
  padding: '40px',
  background: '#ffffff',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  transition: 'background 0.5s ease',
}

const previewH1Style = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#1e1e2e',
  marginBottom: '12px',
  transition: 'all 0.3s ease',
}

const previewPStyle = {
  fontSize: '16px',
  color: '#6b7280',
  marginBottom: '24px',
  transition: 'color 0.3s ease',
}

const previewButtonStyle = {
  padding: '12px 28px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '15px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
}

const particleContainerStyle = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
}

const floatingParticleStyle = {
  position: 'absolute',
  fontSize: '24px',
  animation: 'float-up-particle 1.5s ease-out forwards',
  bottom: '30%',
}

// Community Section
const communityStyle = {
  position: 'relative',
  padding: '120px 24px',
  zIndex: 10,
}

const communityContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: '60px',
  alignItems: 'center',
}

const communityContentStyle = {
  maxWidth: '500px',
}

const communityTitleStyle = {
  fontSize: 'clamp(28px, 5vw, 40px)',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: '#ffffff',
  marginBottom: '20px',
  marginTop: '16px',
}

const communityDescStyle = {
  fontSize: '17px',
  color: 'rgba(255, 255, 255, 0.5)',
  lineHeight: 1.7,
  marginBottom: '32px',
}

const communityFeaturesStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '36px',
}

const communityFeatureStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  fontSize: '16px',
  color: 'rgba(255, 255, 255, 0.7)',
}

const communityCTAStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 28px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 600,
  borderRadius: '12px',
  transition: 'all 0.3s ease',
}

const communityVisualStyle = {
  position: 'relative',
  height: '520px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

// Orbital Globe Styles
const orbitalContainerStyle = {
  position: 'relative',
  width: '550px',
  height: '520px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const globeWrapperStyle = {
  position: 'absolute',
  width: '260px',
  height: '260px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
  zIndex: 50,
}

const globeImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))',
}

const globeGlowStyle = {
  position: 'absolute',
  width: '340px',
  height: '340px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.15) 30%, transparent 70%)',
  filter: 'blur(30px)',
  animation: 'pulse-glow 4s ease-in-out infinite',
  zIndex: -1,
}

const globeInnerGlowStyle = {
  position: 'absolute',
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%)',
  filter: 'blur(15px)',
}

// Orbital ring - Back half (behind globe)
const orbitalRingBackStyle = {
  position: 'absolute',
  width: '480px',
  height: '220px',
  border: '2px solid rgba(59, 130, 246, 0.15)',
  borderRadius: '50%',
  transform: 'rotateX(55deg) translateZ(-20px)',
  transition: 'opacity 1s ease 0.5s',
  zIndex: 40,
  borderTop: '2px solid rgba(59, 130, 246, 0.25)',
  borderBottom: '2px solid transparent',
  background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.03) 0%, transparent 50%)',
}

// Orbital ring - Front half (in front of globe)
const orbitalRingFrontStyle = {
  position: 'absolute',
  width: '480px',
  height: '220px',
  border: '2px solid rgba(59, 130, 246, 0.2)',
  borderRadius: '50%',
  transform: 'rotateX(55deg) translateZ(20px)',
  transition: 'opacity 1s ease 0.6s',
  zIndex: 60,
  borderTop: '2px solid transparent',
  borderBottom: '2px solid rgba(59, 130, 246, 0.3)',
  boxShadow: '0 0 30px rgba(59, 130, 246, 0.1)',
}

const orbitingCardWrapperStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  marginLeft: '-110px',
  marginTop: '-75px',
  transition: 'transform 0.05s linear',
  willChange: 'transform, opacity',
}

const orbitParticlesStyle = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
}

const orbitParticleStyle = {
  position: 'absolute',
  width: '4px',
  height: '4px',
  borderRadius: '50%',
  background: 'rgba(96, 165, 250, 0.6)',
  boxShadow: '0 0 10px rgba(96, 165, 250, 0.8)',
  animation: 'orbit-sparkle 3s ease-in-out infinite',
  top: '50%',
}

const communityCardStyle = {
  position: 'relative',
  width: '220px',
  padding: '16px',
  background: 'rgba(30, 30, 46, 0.95)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '14px',
  backdropFilter: 'blur(20px)',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
}

const communityCardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
}

const avatarStyle = {
  width: '40px',
  height: '40px',
  background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 700,
  color: '#ffffff',
}

const cardAuthorStyle = {
  fontSize: '15px',
  fontWeight: 600,
  color: '#ffffff',
}

const cardDateStyle = {
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.4)',
}

const cardTitleStyle = {
  fontSize: '17px',
  fontWeight: 600,
  color: '#ffffff',
  marginBottom: '12px',
}

const cardStatsStyle = {
  display: 'flex',
  gap: '16px',
  fontSize: '13px',
  color: 'rgba(255, 255, 255, 0.5)',
}

// CTA Section
const ctaSectionStyle = {
  position: 'relative',
  padding: '120px 24px',
  zIndex: 10,
}

const ctaContainerStyle = {
  maxWidth: '700px',
  margin: '0 auto',
  textAlign: 'center',
  position: 'relative',
  padding: '60px 40px',
  background: 'rgba(30, 30, 46, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '24px',
  overflow: 'hidden',
}

const ctaGlowStyle = {
  position: 'absolute',
  top: '-50%',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '600px',
  height: '400px',
  background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.2) 0%, transparent 70%)',
  pointerEvents: 'none',
}

const ctaTitleStyle = {
  fontSize: 'clamp(28px, 5vw, 40px)',
  fontWeight: 800,
  letterSpacing: '-0.03em',
  color: '#ffffff',
  marginBottom: '16px',
  position: 'relative',
}

const ctaDescStyle = {
  fontSize: '18px',
  color: 'rgba(255, 255, 255, 0.5)',
  marginBottom: '32px',
  position: 'relative',
}

const ctaButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '10px',
  padding: '16px 32px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: '17px',
  fontWeight: 600,
  borderRadius: '14px',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 30px rgba(59, 130, 246, 0.35)',
  position: 'relative',
}

// Footer
const footerStyle = {
  position: 'relative',
  padding: '80px 24px 40px',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  background: 'rgba(10, 10, 15, 0.8)',
  zIndex: 10,
}

const footerContainerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
}

const footerMainStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '60px',
  marginBottom: '60px',
}

const footerBrandStyle = {
  maxWidth: '300px',
}

const footerLogoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
}

const footerLogoTextStyle = {
  fontSize: '20px',
  fontWeight: 700,
  color: '#ffffff',
}

const footerTaglineStyle = {
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.4)',
  lineHeight: 1.6,
}

const footerLinksStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '40px',
}

const footerColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const footerColumnTitleStyle = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#ffffff',
  marginBottom: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const footerLinkStyle = {
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.4)',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
}

const footerBottomStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: '30px',
  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  flexWrap: 'wrap',
  gap: '20px',
}

const footerCopyrightStyle = {
  fontSize: '14px',
  color: 'rgba(255, 255, 255, 0.3)',
}

const footerSocialStyle = {
  display: 'flex',
  gap: '16px',
}

const socialLinkStyle = {
  color: 'rgba(255, 255, 255, 0.4)',
  transition: 'color 0.2s ease',
}

export default Landing
