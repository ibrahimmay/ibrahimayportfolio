import React, { useEffect, useState } from 'react';
import './App.css';
import ScrollNavigation from './components/ScrollNavigation';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [text] = useState("Bilgisayar Mühendisi Adayı");
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [activeCard, setActiveCard] = useState(0);
  const [activeSkillCard, setActiveSkillCard] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Matrix effect
  useEffect(() => {
    const canvas = document.getElementById('matrix');
    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '0';
      canvas.style.opacity = '0.8';
    };

    resizeCanvas();

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const alphabet = katakana + latin + nums;

    const fontSize = 16;
    let columns = canvas.width / fontSize;
    let rainDrops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.fillStyle = 'rgba(0, 255, 0, 0.7)';
      context.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    const interval = setInterval(draw, 45);

    const handleResize = () => {
      resizeCanvas();
      columns = canvas.width / fontSize;
      rainDrops = Array(Math.floor(columns)).fill(1);
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[index]);
        setIndex(index + 1);
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  // Portfolio scroll handling
  useEffect(() => {
    const handleScroll = (e) => {
      if (isMobile) {
        const container = e.target;
        const scrollPosition = container.scrollLeft;
        const cardWidth = 300; // card width + gap
        const newActiveCard = Math.round(scrollPosition / cardWidth);
        setActiveCard(newActiveCard);
      }
    };

    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      projectsGrid.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (projectsGrid) {
        projectsGrid.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isMobile]);

  // Skills scroll handling
  useEffect(() => {
    const handleSkillsScroll = (e) => {
      if (isMobile) {
        const container = e.target;
        const scrollPosition = container.scrollLeft;
        const cardWidth = 280; // card width
        const newActiveCard = Math.round(scrollPosition / cardWidth);
        setActiveSkillCard(newActiveCard);
      }
    };

    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
      skillsGrid.addEventListener('scroll', handleSkillsScroll);
    }

    return () => {
      if (skillsGrid) {
        skillsGrid.removeEventListener('scroll', handleSkillsScroll);
      }
    };
  }, [isMobile]);

  // Scroll kontrolü için useEffect
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        // Menü açıkken navbar'ı gizleme
        if (isMenuOpen) {
          setIsNavVisible(true);
          return;
        }

        // Scroll yukarı ise veya en üstteyse navbar'ı göster
        if (currentScrollY < lastScrollY || currentScrollY < 50) {
          setIsNavVisible(true);
        } else {
          setIsNavVisible(false);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY, isMenuOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Burada form gönderme işlemi yapılabilir
    console.log('Form data:', formData);
    // Formu temizle
    setFormData({ name: '', email: '', message: '' });
    alert('Mesajınız gönderildi!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNavClick = (e) => {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').slice(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      // Mobil menüyü kapat
      setIsMenuOpen(false);
      document.body.style.overflow = '';
      
      // Scroll to target
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Menü açıkken sayfanın scroll'unu engelle
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  return (
    <div className="app">
      <LoadingScreen isLoading={isLoading} />
      <div style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
        <ScrollNavigation />
        <canvas id="matrix"></canvas>
        <div className="content">
          <header className={`${!isNavVisible ? 'nav-hidden' : ''}`}>
            <nav>
              <div className="menu-icon" onClick={toggleMenu}>
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </div>
              <ul className={isMenuOpen ? 'active' : ''}>
                <li><a href="#home" onClick={handleNavClick}>Ana Sayfa</a></li>
                <li><a href="#about" onClick={handleNavClick}>Ben Kimim</a></li>
                <li><a href="#skills" onClick={handleNavClick}>Neler Yapabilirim</a></li>
                <li><a href="#portfolio" onClick={handleNavClick}>Neler Yaptım</a></li>
                <li><a href="#contact" onClick={handleNavClick}>İletişim</a></li>
              </ul>
            </nav>
          </header>

          <section id="home" className="section">
            <div className="profile-container">
              <div className="profile-photo">
                <img src="/profile-photo.jpg" alt="Profile" />
              </div>
              <div className="profile-content">
                <h1>Merhaba! Ben İbrahim AY</h1>
                <p className="title typing-effect">{displayText}<span className="cursor">|</span></p>
              </div>
            </div>
          </section>

          <section id="about" className="section">
            <div className="about-container">
              <h2>Ben Kimim</h2>
              <div className="about-card">
                <div className="about-content">
                  <p>Merhaba! Ben İbrahim AY.Balıkesir Üniversitende öğrenim gören yazılıma ve teknolojiye meraklı,
                    üretmeyi ve öğrenmeyi seven bir öğrenciyim. Hem frontend hem de backend
                    tarafında projeler geliştirmeyi, arayüzleri daha kullanıcı dostu hale getirmeyi ve farklı 
                    cihazlarda sorunsuz çalışan siteler yapmayı çok seviyorum.

                    C#, Java, Python, JavaScript, React gibi birçok farklı teknolojiyle çalıştım.
                    Arduino ile donanım projeleri geliştirmekten, Fusion 360 ile tasarımlar yapmaktan da keyif alıyorum.
                    Kısacası dijital dünyada bir şeyler üretmek benim için hem bir iş hem de bir tutku.

                    Yeni şeyler öğrenmeyi, kendimi geliştirmeyi ve farklı projelerde yer almayı her zaman heyecanla karşılıyorum. </p>
                </div>
              </div>
            </div>
          </section>

          <section id="skills" className="section skills-section">
            <h2>Neler Yapabilirim</h2>
            <div className="skills-grid">
              <div className="skill-card">
                <i className="fas fa-code"></i>
                <h3>Frontend Geliştirme</h3>
                <p>HTML, CSS, JavaScript, React, Qt Designer</p>
              </div>
              <div className="skill-card">
                <i className="fas fa-server"></i>
                <h3>Backend Geliştirme</h3>
                <p>C#, Java, Python, SQLite, Arduino</p>
              </div>
              <div className="skill-card">
                <i className="fas fa-mobile-alt"></i>
                <h3>Tasarım</h3>
                <p> Bootstrap, Fusion 360</p>
              </div>
            </div>
            {isMobile && (
              <div className="skills-scroll-indicator">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`skills-scroll-line ${activeSkillCard === index ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}
          </section>

          <section id="portfolio" className="section projects-section">
            <h2>Neler Yaptım</h2>
            <div className="projects-grid">
              <div className="project-card">
                <h3>Hastane Randevu Sistemi</h3>
                <p>Qt Designer, Python ve SQLite ile geliştirilmiş hastane randevu sistemi</p>
                <div className="project-links">
                  <a href="https://github.com/ibrahimmay/hastanerandevuuygulamasi" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
                </div>
              </div>
              <div className="project-card">
                <h3>Kelime İşlemcisi</h3>
                <p>Qt Designer, Python ve SQLite ile geliştirilmiş not defteri</p>
                <div className="project-links">
                  <a href="https://github.com/ibrahimmay/kelimeislemcisi" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
                </div>
              </div>
              <div className="project-card">
                <h3>Soru Bankası Uygulaması</h3>
                <p>Qt Designer, Python ve SQLite ile geliştirilmiş soru bankası uygulaması</p>
                <div className="project-links">
                  <a href="https://github.com/ibrahimmay/sorubankasi" target="_blank" rel="noopener noreferrer"><i className="fab fa-github"></i> GitHub</a>
                </div>
              </div>
            </div>
            {isMobile && (
              <div className="scroll-indicator">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`scroll-line ${activeCard === index ? 'active' : ''}`}
                  />
                ))}
              </div>
            )}
          </section>

          <section id="contact" className="section">
            <h2>İletişim</h2>
            <div className="contact-container">
              <form className="contact-form" onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Ad Soyad</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Soru ve görüşleriniz</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-btn">Gönder</button>
              </form>

              <div className="social-links">
                <h3>Sosyal Medya</h3>
                <div className="social-icons">
                  <a href="https://x.com/__ibrahimay__" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="https://github.com/ibrahimmay" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="https://www.facebook.com/share/1YfduHB4WN/" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a href="https://instagram.com/__ibrahimay__" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://linkedin.com/in/ibrahim-ay-6135962a0" target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <footer>
            <p></p>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default App; 