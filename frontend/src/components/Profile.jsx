import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, Calendar, MapPin, Briefcase,
  Heart, Users, DollarSign, TrendingUp, Bell,
  Shield, Camera, Save, Key, Eye, EyeOff,
  Check, X, Upload
} from 'lucide-react'
import { useUser } from '../components/UserContext'
import styles from '../styles/Profile.module.css'

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [imagePreview, setImagePreview] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)

  const { user, updateProfile } = useUser()

  const [profileData, setProfileData] = useState({
    // Informações Pessoais Básicas
    name: '',
    fullName: '',
    email: '',
    phone: '(11) 99999-9999',
    birthDate: '1990-05-15',
    profileImage: null,

    // Informações Financeiras
    monthlyIncome: 5500,
    extraIncome: 800,
    riskProfile: 'moderado',
    mainGoal: 'imovel',

    // Informações de Contexto
    profession: 'desenvolvedor',
    maritalStatus: 'solteiro',
    dependents: 0,
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',

    // Preferências
    currency: 'BRL',
    notifications: {
      expenses: true,
      goals: true,
      bills: true,
      reports: false
    },
    privacy: {
      shareData: false,
      analytics: true
    }
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Atualizar profileData quando o usuário mudar
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || prev.phone,
        birthDate: user.birthDate || prev.birthDate,
        profileImage: user.profileImage || prev.profileImage,
        monthlyIncome: user.monthlyIncome || prev.monthlyIncome,
        extraIncome: user.extraIncome || prev.extraIncome,
        riskProfile: user.riskProfile || prev.riskProfile,
        mainGoal: user.mainGoal || prev.mainGoal,
        profession: user.profession || prev.profession,
        maritalStatus: user.maritalStatus || prev.maritalStatus,
        dependents: user.dependents || prev.dependents,
        city: user.city || prev.city,
        state: user.state || prev.state,
        zipCode: user.zipCode || prev.zipCode,
        currency: user.currency || prev.currency,
        notifications: user.notifications || prev.notifications,
        privacy: user.privacy || prev.privacy
      }))
    }
  }, [user])

  // Opções para selects
  const professions = [
    { value: 'desenvolvedor', label: 'Desenvolvedor' },
    { value: 'designer', label: 'Designer' },
    { value: 'engenheiro', label: 'Engenheiro' },
    { value: 'medico', label: 'Médico' },
    { value: 'advogado', label: 'Advogado' },
    { value: 'professor', label: 'Professor' },
    { value: 'empresario', label: 'Empresário' },
    { value: 'autonomo', label: 'Autônomo' },
    { value: 'funcionario_publico', label: 'Funcionário Público' },
    { value: 'aposentado', label: 'Aposentado' },
    { value: 'estudante', label: 'Estudante' },
    { value: 'outro', label: 'Outro' }
  ]

  const riskProfiles = [
    { value: 'conservador', label: 'Conservador' },
    { value: 'moderado', label: 'Moderado' },
    { value: 'arrojado', label: 'Arrojado' }
  ]

  const mainGoals = [
    { value: 'imovel', label: 'Comprar um Imóvel' },
    { value: 'independencia', label: 'Independência Financeira' },
    { value: 'viagem', label: 'Viajar o Mundo' },
    { value: 'carro', label: 'Trocar de Carro' },
    { value: 'educacao', label: 'Investir em Educação' },
    { value: 'aposentadoria', label: 'Aposentadoria' },
    { value: 'emergencia', label: 'Fundo de Emergência' }
  ]

  const maritalStatuses = [
    { value: 'solteiro', label: 'Solteiro(a)' },
    { value: 'casado', label: 'Casado(a)' },
    { value: 'divorciado', label: 'Divorciado(a)' },
    { value: 'viuvo', label: 'Viúvo(a)' }
  ]

  const currencies = [
    { value: 'BRL', label: 'Real Brasileiro (R$)' },
    { value: 'USD', label: 'Dólar Americano ($)' },
    { value: 'EUR', label: 'Euro (€)' }
  ]

  const sections = [
    { id: 'personal', label: 'Pessoal', icon: User },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
    { id: 'context', label: 'Contexto', icon: MapPin },
    { id: 'preferences', label: 'Preferências', icon: Bell },
    { id: 'security', label: 'Segurança', icon: Shield }
  ]

  // Funções auxiliares
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const calculateHealthScore = () => {
    let score = 0
    if (profileData.monthlyIncome > 3000) score += 25
    else if (profileData.monthlyIncome > 1500) score += 15
    else score += 5

    if (profileData.riskProfile === 'moderado') score += 25
    else score += 15

    if (profileData.mainGoal !== '') score += 25
    if (profileData.extraIncome > 0) score += 25

    return Math.min(score, 100)
  }

  const getHealthScoreColor = (score) => {
    if (score >= 80) return styles.healthScoreExcellent
    if (score >= 60) return styles.healthScoreGood
    return styles.healthScoreRegular
  }

  const getHealthScoreLabel = (score) => {
    if (score >= 80) return 'Excelente'
    if (score >= 60) return 'Boa'
    if (score >= 40) return 'Regular'
    return 'Precisa Melhorar'
  }

  // Função para obter as iniciais do nome
  const getUserInitials = () => {
    if (profileData.fullName) {
      const names = profileData.fullName.split(' ')
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase()
      }
      return profileData.fullName.substring(0, 2).toUpperCase()
    }
    return 'US'
  }

  // Handlers
  const handleSaveProfile = () => {
    setIsLoading(true)
    setTimeout(() => {
      updateProfile(profileData)
      setMessage({ type: 'success', text: 'Perfil salvo com sucesso!' })
      setIsLoading(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }, 1000)
  }

  const handleChangePassword = () => {
    // Validações
    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Por favor, digite sua senha atual' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (!passwordData.newPassword) {
      setMessage({ type: 'error', text: 'Por favor, digite a nova senha' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 8 caracteres' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Verificar se a senha atual está correta
    if (passwordData.currentPassword !== user?.password) {
      setMessage({ type: 'error', text: 'Senha atual incorreta' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    // Verificar se a nova senha é diferente da atual
    if (passwordData.newPassword === user?.password) {
      setMessage({ type: 'error', text: 'A nova senha deve ser diferente da senha atual' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // Atualizar a senha no perfil
      updateProfile({
        password: passwordData.newPassword
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setIsLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }, 1000);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Por favor, selecione uma imagem JPEG ou PNG' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'A imagem deve ter no máximo 5MB' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
      setShowPreview(true)
    }
    reader.readAsDataURL(file)
  }

  const handleConfirmImage = () => {
    if (!imagePreview) return;
    setIsLoading(true);

    setTimeout(() => {
      // Atualizar a foto no perfil E no contexto do usuário
      const updatedUser = {
        ...user,
        profileImage: imagePreview
      };

      // Atualiza no contexto (que sincroniza com o header)
      updateProfile(updatedUser);

      setMessage({ type: 'success', text: 'Foto de perfil atualizada com sucesso!' });
      setShowPreview(false);
      setImagePreview(null);
      setIsLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1500);
  };

  const handleCancelImage = () => {
    setImagePreview(null)
    setShowPreview(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const healthScore = calculateHealthScore()

  return (
    <div className={`${styles.container} ${isLoading ? styles.loading : ''}`}>
      {/* Preview Modal */}
      {showPreview && (
        <div className={styles.previewModal}>
          <div className={styles.previewContent}>
            <h3 className={styles.previewTitle}>Preview da Nova Foto</h3>
            <img
              src={imagePreview}
              alt="Preview"
              className={styles.previewImage}
            />
            <div className={styles.previewActions}>
              <button
                onClick={handleConfirmImage}
                className={styles.confirmButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className={styles.loadingSpinner}>⟳</div>
                ) : (
                  <Check className={styles.navIcon} />
                )}
                {isLoading ? 'Salvando...' : 'Confirmar'}
              </button>
              <button
                onClick={handleCancelImage}
                className={styles.cancelButton}
                disabled={isLoading}
              >
                <X className={styles.navIcon} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className={styles.title}>Meu Perfil</h2>
          <p className={styles.subtitle}>Gerencie suas informações pessoais e preferências</p>
        </div>

        <div className={styles.healthScore}>
          <div className={styles.healthScoreContent}>
            <div>
              <div className={styles.healthScoreValue}>{healthScore}%</div>
              <div className={styles.healthScoreLabel}>Saúde Financeira</div>
            </div>
            <div className={`${styles.healthScoreBadge} ${getHealthScoreColor(healthScore)}`}>
              {getHealthScoreLabel(healthScore)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Message Display */}
      {message.text && (
        <div className={`${styles.message} ${message.type === 'error' ? styles.errorMessage : styles.successMessage
          }`}>
          {message.text}
        </div>
      )}

      <div className={styles.layout}>
        {/* Sidebar */}
        <motion.div
          className={styles.sidebar}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={styles.sidebarHeader}>
            <div className={styles.avatarContainer} onClick={handleImageClick}>
              <div className={styles.avatar}>
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Foto de perfil"
                    className={styles.avatarImage}
                  />
                ) : (
                  <div className={styles.avatarFallback}>
                    {getUserInitials()}
                  </div>
                )}
              </div>
              <div className={styles.avatarOverlay}>
                <div className={styles.overlayText}>
                  <Camera className={styles.navIcon} />
                  <div>Alterar Foto</div>
                </div>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className={styles.fileInput}
              accept=".jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />

            <h3 className={styles.sidebarName}>{profileData.fullName || profileData.name || 'Usuário'}</h3>
            <p className={styles.sidebarEmail}>{profileData.email || 'user@email.com'}</p>

            <button
              className={styles.changePhotoButton}
              onClick={handleImageClick}
            >
              <Upload className={styles.navIcon} />
              Alterar Foto
            </button>
          </div>
          <nav className={styles.nav}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`${styles.navItem} ${activeSection === section.id ? styles.navItemActive : ''
                  }`}
              >
                <section.icon className={styles.navIcon} />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className={styles.mainContent}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* Seção Pessoal */}
          {activeSection === 'personal' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <User className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Informações Pessoais</h3>
              </div>
              <p className={styles.sectionDescription}>Dados básicos do seu perfil</p>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="name">Nome Completo</label>
                  <input
                    id="name"
                    className={styles.input}
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    className={styles.input}
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Seu e-mail"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="phone">Telefone</label>
                  <input
                    id="phone"
                    className={styles.input}
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="birthDate">Data de Nascimento</label>
                  <input
                    id="birthDate"
                    type="date"
                    className={styles.input}
                    value={profileData.birthDate}
                    onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handleSaveProfile}
                  className={styles.saveButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={styles.loadingSpinner}>⟳</div>
                  ) : (
                    <Save className={styles.navIcon} />
                  )}
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          )}

          {/* Seção Financeira */}
          {activeSection === 'financial' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <DollarSign className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Informações Financeiras</h3>
              </div>
              <p className={styles.sectionDescription}>Dados para personalização da experiência</p>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="monthlyIncome">Renda Mensal Líquida</label>
                  <input
                    id="monthlyIncome"
                    type="number"
                    className={styles.input}
                    value={profileData.monthlyIncome}
                    onChange={(e) => setProfileData(prev => ({ ...prev, monthlyIncome: parseFloat(e.target.value) }))}
                  />
                  <p className={styles.helperText}>Valor que efetivamente entra na conta</p>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="extraIncome">Renda Extra Média</label>
                  <input
                    id="extraIncome"
                    type="number"
                    className={styles.input}
                    value={profileData.extraIncome}
                    onChange={(e) => setProfileData(prev => ({ ...prev, extraIncome: parseFloat(e.target.value) }))}
                  />
                  <p className={styles.helperText}>Freelances, dividendos, etc.</p>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="riskProfile">Perfil de Risco</label>
                <select
                  id="riskProfile"
                  className={styles.input}
                  value={profileData.riskProfile}
                  onChange={(e) => setProfileData(prev => ({ ...prev, riskProfile: e.target.value }))}
                >
                  {riskProfiles.map((profile) => (
                    <option key={profile.value} value={profile.value}>
                      {profile.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="mainGoal">Objetivo Financeiro Principal</label>
                <select
                  id="mainGoal"
                  className={styles.input}
                  value={profileData.mainGoal}
                  onChange={(e) => setProfileData(prev => ({ ...prev, mainGoal: e.target.value }))}
                >
                  {mainGoals.map((goal) => (
                    <option key={goal.value} value={goal.value}>
                      {goal.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.analysisCard}>
                <h4 className={styles.analysisTitle}>Análise Personalizada</h4>
                <p className={styles.analysisText}>
                  Com base na sua renda de {formatCurrency(profileData.monthlyIncome)},
                  sugerimos poupar 20% ({formatCurrency(profileData.monthlyIncome * 0.2)}) mensalmente
                  para atingir seus objetivos financeiros.
                </p>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handleSaveProfile}
                  className={styles.saveButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={styles.loadingSpinner}>⟳</div>
                  ) : (
                    <Save className={styles.navIcon} />
                  )}
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          )}

          {/* Seção Contexto */}
          {activeSection === 'context' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <MapPin className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Informações de Contexto</h3>
              </div>
              <p className={styles.sectionDescription}>Dados para análise avançada e recomendações</p>

              <div className={styles.contextSection}>
                <div className={styles.contextRow}>
                  <div className={styles.contextItem}>
                    <span className={styles.contextLabel}>Profissão</span>
                    <div className={styles.contextValue}>
                      <select
                        className={styles.contextSelect}
                        value={profileData.profession}
                        onChange={(e) => setProfileData(prev => ({ ...prev, profession: e.target.value }))}
                      >
                        {professions.map((profession) => (
                          <option key={profession.value} value={profession.value}>
                            {profession.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.contextItem}>
                    <span className={styles.contextLabel}>Estado Civil</span>
                    <div className={styles.contextValue}>
                      <select
                        className={styles.contextSelect}
                        value={profileData.maritalStatus}
                        onChange={(e) => setProfileData(prev => ({ ...prev, maritalStatus: e.target.value }))}
                      >
                        {maritalStatuses.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.contextRow}>
                  <div className={styles.contextItem}>
                    <span className={styles.contextLabel}>Dependentes</span>
                    <div className={styles.contextValue}>
                      <input
                        type="number"
                        min="0"
                        className={styles.contextInput}
                        value={profileData.dependents}
                        onChange={(e) => setProfileData(prev => ({ ...prev, dependents: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className={styles.contextItem}>
                    <span className={styles.contextLabel}>Cidade</span>
                    <div className={styles.contextValue}>
                      <input
                        className={styles.contextInput}
                        value={profileData.city}
                        onChange={(e) => setProfileData(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.contextRow}>
                  <div className={styles.contextItem}>
                    <span className={styles.contextLabel}>Estado</span>
                    <div className={styles.contextValue}>
                      <input
                        className={styles.contextInput}
                        value={profileData.state}
                        onChange={(e) => setProfileData(prev => ({ ...prev, state: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className={styles.contextItem}>
                    <span className={styles.contextLabel}>CEP</span>
                    <div className={styles.contextValue}>
                      <input
                        className={styles.contextInput}
                        value={profileData.zipCode}
                        onChange={(e) => setProfileData(prev => ({ ...prev, zipCode: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handleSaveProfile}
                  className={styles.saveButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={styles.loadingSpinner}>⟳</div>
                  ) : (
                    <Save className={styles.navIcon} />
                  )}
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          )}

          {/* Seção Preferências */}
          {activeSection === 'preferences' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <Bell className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Preferências</h3>
              </div>
              <p className={styles.sectionDescription}>Configure suas preferências do aplicativo</p>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="currency">Moeda Principal</label>
                <select
                  id="currency"
                  className={styles.input}
                  value={profileData.currency}
                  onChange={(e) => setProfileData(prev => ({ ...prev, currency: e.target.value }))}
                >
                  {currencies.map((currency) => (
                    <option key={currency.value} value={currency.value}>
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.separator}></div>

              <div>
                <h4 className={styles.switchTitle}>Notificações</h4>

                <div className={styles.switchGroup}>
                  <div className={styles.switchContent}>
                    <p className={styles.switchTitle}>Alertas de Gastos</p>
                    <p className={styles.switchDescription}>Receber notificações sobre gastos excessivos</p>
                  </div>
                  <label className={styles.switchContainer}>
                    <input
                      type="checkbox"
                      className={styles.switchInput}
                      checked={profileData.notifications.expenses}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, expenses: e.target.checked }
                      }))}
                    />
                    <span className={styles.switchSlider}></span>
                  </label>
                </div>

                <div className={styles.switchGroup}>
                  <div className={styles.switchContent}>
                    <p className={styles.switchTitle}>Lembretes de Metas</p>
                    <p className={styles.switchDescription}>Receber lembretes sobre suas metas financeiras</p>
                  </div>
                  <label className={styles.switchContainer}>
                    <input
                      type="checkbox"
                      className={styles.switchInput}
                      checked={profileData.notifications.goals}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, goals: e.target.checked }
                      }))}
                    />
                    <span className={styles.switchSlider}></span>
                  </label>
                </div>

                <div className={styles.switchGroup}>
                  <div className={styles.switchContent}>
                    <p className={styles.switchTitle}>Vencimento de Contas</p>
                    <p className={styles.switchDescription}>Receber lembretes de contas a vencer</p>
                  </div>
                  <label className={styles.switchContainer}>
                    <input
                      type="checkbox"
                      className={styles.switchInput}
                      checked={profileData.notifications.bills}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, bills: e.target.checked }
                      }))}
                    />
                    <span className={styles.switchSlider}></span>
                  </label>
                </div>

                <div className={styles.switchGroup}>
                  <div className={styles.switchContent}>
                    <p className={styles.switchTitle}>Relatórios Mensais</p>
                    <p className={styles.switchDescription}>Receber relatórios automáticos por email</p>
                  </div>
                  <label className={styles.switchContainer}>
                    <input
                      type="checkbox"
                      className={styles.switchInput}
                      checked={profileData.notifications.reports}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, reports: e.target.checked }
                      }))}
                    />
                    <span className={styles.switchSlider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.separator}></div>

              <div>
                <h4 className={styles.switchTitle}>Privacidade</h4>

                <div className={styles.switchGroup}>
                  <div className={styles.switchContent}>
                    <p className={styles.switchTitle}>Compartilhar Dados Anônimos</p>
                    <p className={styles.switchDescription}>Ajudar a melhorar o app compartilhando dados anônimos</p>
                  </div>
                  <label className={styles.switchContainer}>
                    <input
                      type="checkbox"
                      className={styles.switchInput}
                      checked={profileData.privacy.shareData}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, shareData: e.target.checked }
                      }))}
                    />
                    <span className={styles.switchSlider}></span>
                  </label>
                </div>

                <div className={styles.switchGroup}>
                  <div className={styles.switchContent}>
                    <p className={styles.switchTitle}>Analytics</p>
                    <p className={styles.switchDescription}>Permitir coleta de dados de uso para melhorias</p>
                  </div>
                  <label className={styles.switchContainer}>
                    <input
                      type="checkbox"
                      className={styles.switchInput}
                      checked={profileData.privacy.analytics}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        privacy: { ...prev.privacy, analytics: e.target.checked }
                      }))}
                    />
                    <span className={styles.switchSlider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handleSaveProfile}
                  className={styles.saveButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={styles.loadingSpinner}>⟳</div>
                  ) : (
                    <Save className={styles.navIcon} />
                  )}
                  {isLoading ? 'Salvando...' : 'Salvar Preferências'}
                </button>
              </div>
            </div>
          )}

          {/* Seção Segurança */}
          {activeSection === 'security' && (
            <div className={styles.sectionCard}>
              <div className={styles.sectionHeader}>
                <Shield className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>Segurança</h3>
              </div>
              <p className={styles.sectionDescription}>Altere sua senha e configure a segurança da conta</p>

              {/* Mostrar senha atual com opção de visualizar */}
              <div className={styles.passwordGroup}>
                <label className={styles.label}>Senha Atual (somente visualização)</label>
                <div className={styles.passwordInputContainer}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input}
                    value={user?.password || ''}
                    readOnly
                    placeholder="Sua senha atual"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className={styles.navIcon} /> : <Eye className={styles.navIcon} />}
                  </button>
                </div>
                <p className={styles.helperText}>Sua senha atual (somente visualização)</p>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="currentPassword">Senha Atual *</label>
                  <div className={styles.passwordInputContainer}>
                    <input
                      id="currentPassword"
                      type={showPassword ? 'text' : 'password'}
                      className={styles.input}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Digite sua senha atual para confirmar"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className={styles.navIcon} /> : <Eye className={styles.navIcon} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="newPassword">Nova Senha *</label>
                  <div className={styles.passwordInputContainer}>
                    <input
                      id="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      className={styles.input}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Digite a nova senha"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className={styles.navIcon} /> : <Eye className={styles.navIcon} />}
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="confirmPassword">Confirmar Nova Senha *</label>
                  <div className={styles.passwordInputContainer}>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      className={styles.input}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirme a nova senha"
                    />
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className={styles.navIcon} /> : <Eye className={styles.navIcon} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.securityTips}>
                <h4 className={styles.securityTipsTitle}>Dicas de Segurança</h4>
                <ul className={styles.securityTipsList}>
                  <li>Use pelo menos 8 caracteres</li>
                  <li>Inclua letras maiúsculas e minúsculas</li>
                  <li>Adicione números e símbolos</li>
                  <li>Não use informações pessoais</li>
                </ul>
              </div>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handleChangePassword}
                  className={styles.securityButton}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className={styles.loadingSpinner}>⟳</div>
                  ) : (
                    <Key className={styles.navIcon} />
                  )}
                  {isLoading ? 'Alterando...' : 'Alterar Senha'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Profile