import React, { useState, useRef, useEffect } from 'react';
// 1. A importação foi corrigida para usar o objeto de estilos
import styles from '../styles/App.module.css';
import banner2 from '../assets/Img/celular.png';
import banner3 from '../assets/Img/banner3.png';
import banner4 from '../assets/Img/banner4.png';
import banner5 from '../assets/Img/banner5.png';
import dinheiro from '../assets/Img/dinheiro.png';
import escudo from '../assets/Img/escudo.png';
import footerLogo from '../assets/Img/footer-logo.png';
import graficoCrescente from '../assets/Img/grafico-crescente.png';
import inovacao from '../assets/Img/inovacao.png';
import logo from '../assets/Img/logo.png';
import loja from '../assets/Img/loja.png';
import lotus_assistente from '../assets/Img/lotus-assistente-img.png';
import mulherCelular from '../assets/Img/Mulher-celular.png';
import mulherCelular2 from '../assets/Img/Mulher-celular2.png';
import servicos1 from '../assets/Img/servicos1.png';
import servicos2 from '../assets/Img/servicos2.png';
import servicos3 from '../assets/Img/servicos3.png';
import transparencia from '../assets/Img/transparencia.png';
import Chatbot from '../components/chatbot/Chatbot';
import LoginModal from '../components/modals/LoginModal';
import RegisterModal from '../components/modals/RegisterModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import InvalidSearchModal from '../components/modals/Sembusca';
import { UserProvider } from '../components/UserContext';
import UserPage from './UserPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // (O restante do seu código de lógica, estados e efeitos permanece o mesmo)
  // ...
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotFlow, setChatbotFlow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);
  const [invalidSearch, setInvalidSearch] = useState(false);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        enableScroll();
        setSearchOpen(false);
        setModalOpen(null);
        setIsChatbotOpen(false);
      }
    }
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  function handleMobileLinkClick(id) {
    setMenuOpen(false);
    enableScroll();
    scrollToSection(id);
  }

  function disableScroll() {
    document.body.style.overflow = 'hidden';
  }

  function enableScroll() {
    document.body.style.overflow = '';
  }

  useEffect(() => {
    const text = "Sua vida financeira, sob controle";
    const el = document.getElementById("typewriter-text");
    if (!el) return;
    let i = 0;
    let isDeleting = false;
    let speed = 120;
    let pause = 3500;

    function typeWriterLoop() {
      if (!isDeleting && i <= text.length) {
        if (i < text.length) {
          el.innerHTML = text.substring(0, i) + `<span class="${styles['type-cursor']}" aria-hidden="true"></span>`;
        } else {
          el.innerHTML = text;
          setTimeout(() => {
            isDeleting = true;
            typeWriterLoop();
          }, pause);
          return;
        }
        i++;
      } else if (isDeleting && i >= 0) {
        if (i > 0) {
          el.innerHTML = text.substring(0, i) + `<span class="${styles['type-cursor']}" aria-hidden="true"></span>`;
        } else {
          el.innerHTML = "";
          isDeleting = false;
          setTimeout(typeWriterLoop, 600);
          return;
        }
        i--;
      }
      setTimeout(typeWriterLoop, isDeleting ? 70 : speed);
    }
    typeWriterLoop();
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((open) => {
      const newState = !open;
      if (newState) disableScroll(); else enableScroll();
      return newState;
    });
  };
  const toggleSearch = () => {
    setSearchOpen((open) => !open);
    setTimeout(() => {
      if (searchInputRef.current) searchInputRef.current.focus();
    }, 100);
  };
  const toggleDropdown = (index) => setActiveDropdown(activeDropdown === index ? null : index);
  const openModal = (modalId) => {
  setModalOpen(modalId); // Isso automaticamente fecha qualquer modal anterior
};
  const closeModal = () => setModalOpen(null);

  const openChatbot = (flowType = null) => {
    setIsChatbotOpen(true);
    setChatbotFlow(flowType);
  };

  const closeChatbot = () => {
    setIsChatbotOpen(false);
    setChatbotFlow(null);
  };

  const simulateLoading = (duration = 1000, callback) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (callback) callback();
    }, duration);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase();
    const sectionMap = {
      'segurança': 'seguranca', 'seguranca': 'seguranca', 'serviços': 'servicos',
      'servicos': 'servicos', 'suporte': 'suporte', 'sobre nós': 'sobrenos',
      'sobrenos': 'sobrenos', 'sobre nos': 'sobrenos'
    };
    const actionMap = {
      'acessar conta': () => setModalOpen('login'), 'abrir conta': () => setModalOpen('register'),
      'login': () => setModalOpen('login'), 'registrar': () => setModalOpen('register'),
      'cadastro': () => setModalOpen('register')
    };
    if (sectionMap[term]) {
      const element = document.getElementById(sectionMap[term]);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        resetSearch();
        return;
      }
    }
    if (actionMap[term]) {
      actionMap[term]();
      resetSearch();
      return;
    }
    setInvalidSearch(true);
    resetSearch();
  };

  const resetSearch = () => {
    setSearchOpen(false);
    setSearchTerm('');
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    simulateLoading(1500, () => {
      alert("Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.");
      e.target.reset();
    });
  };

  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const banners = [
    {
      img: banner3,
      alt: "Pessoa feliz controlando suas finanças pelo celular",
      title: "Você no Controle do seu dinheiro",
      desc: "Com a Prospera, você visualiza todos seus gastos e receitas em um só lugar, de forma simples e organizada.",
      linkText: "Abra sua conta!",
      action: () => openModal('register') // Abre modal de cadastro
    },
    {
      img: banner5,
      alt: "Pessoa feliz acessando sua conta Prospera",
      title: "Conquiste sua liberdade financeira",
      desc: "Acesse sua conta e acompanhe sua jornada financeira de forma clara e segura.",
      linkText: "Acesse sua conta!",
      action: () => openModal('login') // Abre modal de login
    }
  ];

  const ANIMATION_DURATION = 800;

  const nextSlide = () => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    setTimeout(() => setTransitioning(false), ANIMATION_DURATION);
  };

  const prevSlide = () => {
    if (transitioning) return;
    setTransitioning(true);
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
    setTimeout(() => setTransitioning(false), ANIMATION_DURATION);
  };

  function useScrollReveal() {
    const ref = useRef();
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add(styles.visible);
            observer.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      el.classList.add(styles['section-reveal']);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return ref;
  }

  const heroRef = useScrollReveal();
  const secBannerRef = useScrollReveal();
  const segurancaRef = useScrollReveal();
  const vantagensRef = useScrollReveal();
  const appRef = useScrollReveal();
  const servicosRef = useScrollReveal();
  const suporteRef = useScrollReveal();
  const sobreRef = useScrollReveal();
  const dropRef = useScrollReveal();

  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      section.classList.remove(styles.visible);
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        section.classList.add(styles.visible);
      }, 400);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      window.onload = () => {
        setTimeout(() => {
          scrollToSection(id);
        }, 100);
      };
    }
  }, []);

  const [userName, setUserName] = useState('');

  const handleRegisterSuccess = (name) => {
    setUserName(name);
    openModal('confirmation');
  };



  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/user" element={<UserPage />} />
          <Route path="/" element={
            // 2. Todas as className foram atualizadas para usar o objeto 'styles'
            <div className={styles.App}>
              <a href="#main-content" className={styles['skip-link']}></a>

              <header>
                <div className={`${styles.container} ${styles['header-container']}`}>
                  <div className={styles.logo}>
                    <a href="#home" aria-label="Prospera - Página inicial">
                      <img src={logo} alt="Logo Prospera - Controle financeiro pessoal" onClick={e => { e.preventDefault(); scrollToSection('home'); }} />
                    </a>
                  </div>

                  <nav className={styles['desktop-menu']} aria-label="Navegação principal">
                    <ul>
                      <li><a href="#home" onClick={e => { e.preventDefault(); scrollToSection('home'); }}>Home</a></li>
                      <li><a href="#seguranca" onClick={e => { e.preventDefault(); scrollToSection('seguranca'); }}>Segurança</a></li>
                      <li><a href="#servicos" onClick={e => { e.preventDefault(); scrollToSection('servicos'); }}>Serviços</a></li>
                      <li><a href="#suporte" onClick={e => { e.preventDefault(); scrollToSection('suporte'); }}>Suporte</a></li>
                      <li><a href="#sobrenos" onClick={e => { e.preventDefault(); scrollToSection('sobrenos'); }}>Sobre Nós</a></li>
                    </ul>
                  </nav>

                  <button
                    className={styles['menu-toggle']}
                    aria-label="Abrir menu"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    onClick={toggleMenu}
                  >
                    <i className="fas fa-bars" aria-hidden="true"></i>
                  </button>

                  <div className={styles['header-options']}>
                    <button className={styles['search-icon']} aria-label="Abrir busca" onClick={toggleSearch}>
                      <i className="fas fa-search" aria-hidden="true"></i>
                    </button>
                    {searchOpen && (
                      <div className={styles['search-box']} aria-hidden={!searchOpen}>
                        <form role="search" onSubmit={handleSearchSubmit}>
                          <input
                            type="text"
                            placeholder="Buscar por..."
                            aria-label="Buscar no site"
                            ref={searchInputRef}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            required
                          />
                          <button className={styles['search-close']} aria-label="Fechar busca" onClick={() => setSearchOpen(false)}>
                            <i className="fas fa-times" aria-hidden="true"></i>
                          </button>
                        </form>
                      </div>
                    )}
                    <div className={styles['account-buttons']}>
                      <button className={`${styles.btn} ${styles['btn-primary']} ${styles['acessar-conta']}`} onClick={() => openModal('login')}>Acessar Conta</button>
                      <button className={`${styles.btn} ${styles['btn-outline']} ${styles['abrir-conta']}`} onClick={() => openModal('register')}>Abrir Conta</button>
                    </div>
                  </div>
                </div>

                <div className={`${styles['mobile-menu']} ${menuOpen ? styles.open : ''}`} id="mobile-menu" aria-hidden={!menuOpen}>
                  <button className={styles['close-menu']} aria-label="Fechar menu" onClick={toggleMenu}>
                    <i className="fas fa-times" aria-hidden="true"></i>
                  </button>
                  <ul>
                    <li><a href="#home" onClick={e => { e.preventDefault(); handleMobileLinkClick('home'); }}>Home</a></li>
                    <li><a href="#seguranca" onClick={e => { e.preventDefault(); handleMobileLinkClick('seguranca'); }}>Segurança</a></li>
                    <li><a href="#servicos" onClick={e => { e.preventDefault(); handleMobileLinkClick('servicos'); }}>Serviços</a></li>
                    <li><a href="#suporte" onClick={e => { e.preventDefault(); handleMobileLinkClick('suporte'); }}>Suporte</a></li>
                    <li><a href="#sobrenos" onClick={e => { e.preventDefault(); handleMobileLinkClick('sobrenos'); }}>Sobre Nós</a></li>
                  </ul>
                </div>

                <div className={`${styles['menu-backdrop']} ${menuOpen ? styles.active : ''}`} aria-hidden={!menuOpen} onClick={toggleMenu}></div>

                <div className={`${styles['search-box']} ${searchOpen ? styles.active : ''}`} aria-hidden={!searchOpen}>
                  <form role="search" onSubmit={handleSearchSubmit}>
                    <input
                      type="text"
                      placeholder="Buscar por..."
                      aria-label="Buscar no site"
                      ref={searchInputRef}
                      required
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                    <button className={styles['search-close']} aria-label="Fechar busca" onClick={toggleSearch}>
                      <i className="fas fa-times" aria-hidden="true"></i>
                    </button>
                  </form>
                </div>
              </header>

              <main id="main-content">
                <section
                  className={`${styles.container} ${styles['hero-banner']} ${styles['section-reveal']} ${heroVisible ? styles.visible : ''}`}
                  id="home"
                  ref={heroRef}
                >
                  <div className={styles['hero-content']}>
                    <h1 className={styles.typewriter} id="typewriter-text"></h1>
                    <p className={styles['hero-description']}>
                      Controle suas finanças com uma plataforma segura para definir metas, monitorar gastos e alcançar prosperidade.
                    </p>
                    <a href="#servicos" className={styles.arrow}>
                      Conheça a Prospera
                      <span className={styles.arrow} aria-hidden="true">→</span>
                    </a>
                  </div>
                  <div className={styles['hero-image']}>
                    <img src={banner2} alt="Dashboard do aplicativo Prospera mostrando gráficos de controle financeiro" loading="lazy" />
                  </div>
                </section>

                <section className={styles.container} ref={secBannerRef}>
                  <div className={styles['secondary-banner']}>
                    {banners.map((banner, index) => (
                      <div
                        key={index}
                        className={`${styles['slide-container']} ${index === current ? '' : (index < current ? styles['slide-left'] : styles['slide-right'])}`}
                        style={{ zIndex: banners.length - index, opacity: index === current ? 1 : 0 }}
                      >
                        <img src={banner.img} alt={banner.alt} loading="lazy" className={styles['main-image']} />
                        <div className={styles['banner-content']}>
                          <h2>{banner.title}</h2>
                          <p>{banner.desc}</p>
                          <button
                            className={styles['btn-arrow']}
                            onClick={() => banner.action()}
                            aria-label={banner.linkText}
                          >
                            {banner.linkText}
                            <span className={styles.arrow} aria-hidden="true">→</span>
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Botões de navegação - APENAS para mudar entre imagens */}
                    <div className={styles['banner-navigation']}>
                      <button
                        className={styles['nav-arrow']}
                        aria-label="Banner anterior"
                        onClick={prevSlide}
                        disabled={transitioning}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button
                        className={styles['nav-arrow']}
                        aria-label="Próximo banner"
                        onClick={nextSlide}
                        disabled={transitioning}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </section>

                <section id="seguranca" className={styles['security-section']} ref={segurancaRef}>
                  <div className={styles.container}>
                    <h2>Segurança</h2>
                    <p className={styles['section-subtitle']}>Estamos aqui para te dar suporte completo e garantir a proteção do seu dinheiro</p>
                    <div className={styles['security-cards']}>
                      <div className={styles['security-card']} onClick={() => openChatbot('me_roubaram')} tabIndex="0" role="button">
                        <h3>Me roubaram</h3>
                        <p>Procedimentos para bloquear sua conta em caso de perda ou roubo do dispositivo</p>
                        <a href="#" className={styles['btn-arrow']} onClick={(e) => e.preventDefault()}>→</a>
                      </div>
                      <div className={styles['security-card']} onClick={() => openChatbot('denuncias')} tabIndex="0" role="button">
                        <h3>Canal de Denúncias</h3>
                        <p>Reporte atividades suspeitas ou violações de segurança</p>
                        <a href="#" className={styles['btn-arrow']} onClick={(e) => e.preventDefault()}>→</a>
                      </div>
                      <div className={styles['security-card']} onClick={() => openChatbot('protecao')} tabIndex="0" role="button">
                        <h3>Central de Proteção</h3>
                        <p>Recursos avançados para proteger suas transações e dados</p>
                        <a href="#" className={styles['btn-arrow']} onClick={(e) => e.preventDefault()}>→</a>
                      </div>
                      <div className={styles['security-card']} onClick={() => openChatbot('atendimento')} tabIndex="0" role="button">
                        <h3>Canais de Atendimento</h3>
                        <p>Suporte especializado disponível 24/7 para emergências</p>
                        <a href="#" className={styles['btn-arrow']} onClick={(e) => e.preventDefault()}>→</a>
                      </div>
                    </div>
                    <div className={styles['text-center']}>
                      <a href="#dropdown-section" className={`${styles.btn} ${styles['btn-primary']}`}>Saiba Mais</a>
                    </div>
                  </div>
                </section>

                <section className={styles['dropdown-section']} id="dropdown-section" ref={vantagensRef}>
                  <div className={styles.container}>
                    <p className={styles['section-subtitle']}>Conheça as soluções de segurança do nosso serviço.</p>
                    <div className={styles['dropdown-container']} ref={dropRef}>
                      {[
                        { title: "Autenticação de dois fatores (2FA)", content: "Sistema de autenticação de dois fatores para garantir que apenas você tenha acesso à sua conta. Receba códigos via SMS, e-mail ou aplicativo autenticador." },
                        { title: "Política de senhas fortes", content: "Exigência de senhas complexas com mínimo de 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais para maior segurança das contas." },
                        { title: "Limite de tentativas de login", content: "Bloqueio temporário da conta após 5 tentativas de login malsucedidas, prevenindo ataques de força bruta." },
                        { title: "Alertas em Tempo Real", content: "Notificações instantâneas por e-mail e SMS para todas as transações e atividades suspeitas em sua conta." },
                        { title: "Alertas de segurança", content: "Sistema de alertas proativos que notifica sobre ameaças de segurança conhecidas e medidas preventivas." },
                        { title: "Logs de atividades", content: "Registro detalhado de todas as atividades da conta, com data, hora e localização, disponível para consulta a qualquer momento." },
                        { title: "Plano de resposta a incidentes", content: "Procedimentos estabelecidos para contenção, investigação e recuperação em caso de incidentes de segurança." },
                        { title: "Histórico de Acessos e Sessões Ativas", content: "Visualização de todos os dispositivos conectados à sua conta, com opção de encerrar sessões remotamente." },
                        { title: "Autenticação Reforçada para Alterações Críticas", content: "Verificação adicional de identidade para operações sensíveis como alteração de dados cadastrais, e-mail ou recuperação de conta." },
                        { title: "Atendimento 24/7 para Emergências", content: "Canais prioritários de atendimento para situações de emergência, com tempo de resposta reduzido." },
                        { title: "E-mail de Segurança Dedicado", content: "Endereço exclusivo para reportar problemas de segurança, monitorado continuamente por nossa equipe especializada." }
                      ].map((item, index) => (
                        <div className={`${styles['dropdown-card']} ${activeDropdown === index ? styles.active : ''}`} key={index}>
                          <button
                            className={styles['dropdown-header']}
                            aria-expanded={activeDropdown === index}
                            onClick={() => toggleDropdown(index)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleDropdown(index); } }}
                          >
                            <span>{item.title}</span>
                            <i className={`fas fa-chevron-${activeDropdown === index ? 'up' : 'down'} ${styles['dropdown-icon']}`} aria-hidden="true"></i>
                          </button>
                          <div className={`${styles['dropdown-content']} ${activeDropdown === index ? styles.active : ''}`}>
                            <p className={styles['dropdown-text']}>{item.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className={styles['features-section']} ref={vantagensRef}>
                  <div className={styles.container}>
                    <div className={styles['features-box']}>
                      <h2>Vantagens do nosso serviço</h2>
                      <ul className={styles['features-list']}>
                        <li><i className="fas fa-check-circle" aria-hidden="true"></i> Cadastro de Receitas e Despesas</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true"></i> Orçamento Mensal personalizado</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true"></i> Relatórios e Gráficos detalhados</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true"></i> Metas de Economia com acompanhamento</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true"></i> Simulador de Patrimônio</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true"></i> Controle de investimentos</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true"></i> Lembretes de pagamento</li>
                        <li><i className="fas fa-check-circle" aria-hidden="true"></i> Análise de gastos por categoria</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className={styles.container} ref={appRef}>
                  <div className={styles['app-section']} id="app-section">
                    <div className={styles['app-image']}>
                      <img src={banner4} alt="Aplicativo Prospera para download em iOS e Android" loading="lazy" />
                    </div>
                    <div className={styles['app-content']}>
                      <h2>Baixe nosso app e assuma o controle das suas finanças!</h2>
                      <p>Disponível para iOS e Android. Todas as funcionalidades da plataforma web na palma da sua mão.</p>
                      <div className={styles['download-buttons']}>
                        <a href="#" className={styles['btn-download']} aria-label="Baixar na App Store">
                          <i className="fab fa-apple" aria-hidden="true"></i> App Store
                        </a>
                        <a href="#" className={styles['btn-download']} aria-label="Baixar no Google Play">
                          <i className="fab fa-google-play" aria-hidden="true"></i> Google Play
                        </a>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="servicos" className={styles['services-section']} ref={servicosRef}>
                  <div className={styles.container}>
                    <h2 className={styles['section-title']}>Serviços</h2>
                    <div className={styles['service-item']}>
                      <div className={styles['service-content']}>
                        <h3>Relatórios e Gráficos</h3>
                        <p>Visualização de gastos por período, categoria ou método de pagamento com relatórios detalhados e personalizáveis.</p>
                        <ul><li>Comparativo mês a mês</li><li>Análise de evolução patrimonial</li><li>Projeções financeiras futuras</li></ul>
                      </div>
                      <div className={styles['service-image']}><img src={servicos1} alt="Relatórios e gráficos de controle financeiro" loading="lazy" /></div>
                    </div>
                    <div className={styles['service-item']}>
                      <div className={styles['service-content']}>
                        <h3>Metas de Economia</h3>
                        <p>Estabeleça objetivos financeiros e acompanhe seu progresso com ferramentas especializadas.</p>
                        <ul><li>Cálculo automático de quanto poupar por mês</li><li>Separador automático de valores (como "cofres digitais")</li><li>Alertas de progresso e recomendações</li></ul>
                      </div>
                      <div className={styles['service-image']}><img src={servicos2} alt="Metas de economia e planejamento financeiro" loading="lazy" /></div>
                    </div>
                    <div className={styles['service-item']}>
                      <div className={styles['service-content']}>
                        <h3>Controle de Recorrentes</h3>
                        <p>Identificação e gestão das suas despesas fixas e variáveis com alertas personalizados.</p>
                        <ul><li>Organização automática por categorias</li><li>Alertas de vencimento de contas</li><li>Análise de oportunidades de economia</li></ul>
                      </div>
                      <div className={styles['service-image']}><img src={servicos3} alt="Controle de despesas recorrentes" loading="lazy" /></div>
                    </div>
                  </div>
                </section>

                <section id="suporte" className={styles['support-section']} ref={suporteRef}>
                  <div className={styles.container}>
                    <h2 className={styles['section-title']}>Suporte</h2>
                    <div className={styles['contact-form']}>
                      <h2>Está com problemas?</h2>
                      <h4>Fale conosco!</h4>
                      <form id="support-form" onSubmit={handleSupportSubmit}>
                        <div className={styles['form-group']}><input type="text" id="name" placeholder="Digite seu nome" required /></div>
                        <div className={styles['form-group']}><input type="email" id="email" placeholder="Digite seu email" required /></div>
                        <div className={styles['form-group']}>
                          <select id="subject" required>
                            <option value="">Selecione o assunto</option><option value="problema">Problema técnico</option>
                            <option value="sugestao">Sugestão</option><option value="duvida">Dúvida</option><option value="outro">Outro</option>
                          </select>
                        </div>
                        <div className={styles['form-group']}><textarea id="message" placeholder="Descreva detalhadamente o motivo do seu contato..." required></textarea></div>
                        <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>Enviar mensagem</button>
                      </form>
                      <div className={styles['contact-alternatives']}>
                        <h4>Outras formas de contato:</h4>
                        <p><i className="fas fa-envelope" aria-hidden="true"></i> suporte@prospera.com</p>
                        <p><i className="fas fa-phone" aria-hidden="true"></i> (11) 3456-7890</p>
                        <p><i className="fas fa-comments" aria-hidden="true"></i> Chat online (24h)</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section id="sobrenos" className={styles['about-section']} ref={sobreRef}>
                  <div className={styles.container}>
                    <h2 className={styles['section-title']}>Sobre Nós</h2>
                    <div className={styles['goals-section']}>
                      <h2>Ajudando você a atingir suas metas</h2>
                      <p>Um dos focos do nosso aplicativo é fornecer uma forma de você economizar para atingir suas metas. Através de lembretes personalizados, dicas financeiras e acompanhamento especializado, ajudamos você a atingir suas metas. Essa é a nossa prioridade: sua prosperidade financeira.</p>
                    </div>
                    <h3 className={styles['section-title']}>Nossos Compromissos</h3>
                    <div className={styles['commitments-grid']}>
                      <div className={styles['img-about-1']}><img src={mulherCelular} alt="Cliente satisfeita usando o aplicativo Prospera no celular" loading="lazy" /></div>
                      <div className={styles['commitment-card']}>
                        <img src={dinheiro} alt="Ícone de controle financeiro" /><h4>Controle Financeiro</h4>
                        <p>Pretendemos ajudar você a controlar suas despesas e gastos de forma intuitiva e eficiente.</p>
                      </div>
                      <div className={styles['commitment-card']}>
                        <img src={graficoCrescente} alt="Ícone de análise em tempo real" /><h4>Análise em tempo real</h4>
                        <p>Disponibilizaremos para você uma análise completa e um acompanhamento detalhado de sua renda e gastos.</p>
                      </div>

                      <div className={styles['commitment-card']}>
                        <img src={loja} alt="Ícone de ajuda em metas" />
                        <h4>Ajudar nas suas metas</h4>
                        <p>Nos comprometemos a ajudar você a economizar e atingir suas metas financeiras com planejamento e suporte.</p>
                      </div>
                    </div>

                    <h3 className={styles['section-title']}>O que nós garantimos para você</h3>
                    <div className={styles['guarantees-grid']}>
                      <div className={styles['guarantee-card']}>
                        <img src={escudo} alt="Ícone de segurança" />
                        <h4>Segurança</h4>
                        <p>Seus dados protegidos com criptografia de ponta a ponta e protocolos de segurança avançados.</p>
                      </div>

                      <div className={styles['guarantee-card']}>
                        <img src={inovacao} alt="Ícone de inovação" />
                        <h4>Inovação</h4>
                        <p>Recursos constantemente atualizados com as melhores práticas e tecnologias do mercado.</p>
                      </div>

                      <div className={styles['guarantee-card']}>
                        <img src={transparencia} alt="Ícone de transparência" />
                        <h4>Transparência</h4>
                        <p>Sem taxas escondidas ou surpresas. Tudo claro e explicado de forma simples e direta.</p>
                      </div>

                      <div className={styles['img-about-2']}>
                        <img src={mulherCelular2} alt="Cliente feliz com suas economias usando o aplicativo Prospera" loading="lazy" />
                      </div>
                    </div>
                  </div>
                </section>
              </main>

              <footer>
                <div className={styles.container}>
                  <div className={styles['footer-container']}>
                    <div className={`${styles['footer-col']} ${styles['footer-brand']}`}>
                      <img src={footerLogo} alt="Logo Prospera" className={styles['footer-logo']} loading="lazy" />
                      <p className={styles['footer-desc']}>A Prospera é sua parceira para uma vida financeira mais segura, simples e próspera.</p>
                    </div>

                    <div className={styles['footer-col']}>
                      <h4>Recursos</h4>
                      <ul>
                        <li><a href="#">Segurança</a></li>
                        <li><a href="#">Serviços</a></li>
                        <li><a href="#">Novidades</a></li>
                        <li><a href="#">Suporte</a></li>
                      </ul>
                    </div>

                    <div className={styles['footer-col']}>
                      <h4>Planos</h4>
                      <ul>
                        <li><a href="#">Básico</a></li>
                        <li><a href="#">Premium</a></li>
                        <li><a href="#">Família</a></li>
                      </ul>
                    </div>

                    <div className={styles['footer-col']}>
                      <h4>Institucional</h4>
                      <ul>
                        <li><a href="#">Contato</a></li>
                        <li><a href="#">Sobre Nós</a></li>
                        <li><a href="#">Trabalhe Conosco</a></li>
                        <li><a href="#">Perguntas Frequentes</a></li>
                      </ul>
                    </div>

                    <div className={styles['footer-col']}>
                      <h4>Assine nossa newsletter</h4>
                      <div className={styles['footer-newsletter']}>
                        <div className={styles['newsletter-box']}>
                          <input type="email" placeholder="Seu e-mail" aria-label="Seu e-mail para newsletter" required />
                          <button type="submit" aria-label="Assinar newsletter">
                            <i className="fas fa-arrow-right" aria-hidden="true"></i>
                          </button>
                        </div>
                      </div>

                      <h4>Siga-nos</h4>
                      <div className={styles['social-icons']}>
                        <a href="#" title="Twitter" aria-label="Siga-nos no Twitter"><i className="fab fa-x-twitter" aria-hidden="true"></i></a>
                        <a href="#" title="Instagram" aria-label="Siga-nos no Instagram"><i className="fab fa-instagram" aria-hidden="true"></i></a>
                        <a href="#" title="Facebook" aria-label="Siga-nos no Facebook"><i className="fab fa-facebook-f" aria-hidden="true"></i></a>
                      </div>
                    </div>
                  </div>

                  <div className={styles['footer-bottom']}>
                    <span className={styles['footer-copy']}>&copy; 2025 Prospera. Todos os direitos reservados.</span>
                    <div className={styles['footer-links']}>
                      <a href="#">Política de Privacidade</a>
                      <a href="#">Termos de Serviço</a>
                      <a href="#">Configurações de Cookies</a>
                    </div>
                  </div>
                </div>
              </footer>

              <LoginModal
                isOpen={modalOpen === 'login'}
                onClose={closeModal}
                onLoginSuccess={() => {
                  setModalOpen(null);
                }}
                onSwitchToRegister={() => setModalOpen('register')} // ← Adicione esta linha
              />

              <RegisterModal
                isOpen={modalOpen === 'register'}
                onClose={closeModal}
                onRegisterSuccess={(name) => {
                  setUserName(name);
                  setModalOpen('confirmation');
                  setTimeout(() => setModalOpen('login'), 1800);
                }}
                onSwitchToLogin={() => setModalOpen('login')} // ← Adicione esta linha
              />
              <ConfirmationModal
                isOpen={modalOpen === 'confirmation'}
                onClose={() => setModalOpen('login')}
                userName={userName}
              />
              <Chatbot isOpen={isChatbotOpen} onClose={closeChatbot} startFlow={chatbotFlow} />
              <InvalidSearchModal isOpen={invalidSearch} onClose={() => setInvalidSearch(false)} />

              {/* Botão flutuante para abrir o chatbot */}
              {!isChatbotOpen && (
                <button className="chatbot-fab" onClick={() => openChatbot()}>
                  <img src={lotus_assistente} alt="Assistente Lótus" />
                </button>
              )}
            </div>
          } />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

