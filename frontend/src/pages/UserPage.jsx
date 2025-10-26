// UserPage.jsx
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, User, Target, PieChart, FileText, Wallet, X, Plus, LogOut } from 'lucide-react';
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import Dashboard from '@/components/Dashboard';
import Goals from '@/components/Goals';
import Profile from '@/components/Profile';
import Patrimony from '@/components/Patrimony';
import Reports from '@/components/Reports';
import Finances from '@/components/Finances';
import styles from '../styles/UserPage.module.css';

function UserPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isNewGoalModalOpen, setIsNewGoalModalOpen] = useState(false);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, component: Dashboard },
    { id: 'finances', label: 'Finanças', icon: Wallet, component: Finances },
    { id: 'goals', label: 'Metas', icon: Target, component: Goals },
    { id: 'patrimony', label: 'Patrimônio', icon: PieChart, component: Patrimony },
    { id: 'reports', label: 'Relatórios', icon: FileText, component: Reports },
    { id: 'profile', label: 'Perfil', icon: User, component: Profile },
  ];

  // Função para obter o avatar (imagem ou iniciais)
  const getUserAvatar = () => {
    if (!user) return { type: 'initials', content: 'U' };
    
    if (user.profileImage) {
      return { type: 'image', content: user.profileImage };
    }
    
    // Se não tem imagem, usa as iniciais
    if (user.fullName) {
      const names = user.fullName.split(' ');
      if (names.length >= 2) {
        return { type: 'initials', content: (names[0][0] + names[names.length - 1][0]).toUpperCase() };
      }
      return { type: 'initials', content: user.fullName.substring(0, 2).toUpperCase() };
    }
    
    return { type: 'initials', content: 'U' };
  };

  // Função para fazer logout
  const handleLogout = () => {
    logout();
    // Força um recarregamento completo da página
    window.location.href = '/';
  };

  // Componente NewGoalModal integrado
  const NewGoalModal = ({ isOpen, onClose, onSaveGoal }) => {
    const [formData, setFormData] = useState({
      name: '',
      category: 'Imóvel',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
    });

    const categories = ['Imóvel', 'Viagem', 'Emergência', 'Educação', 'Investimento', 'Outro'];

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validação básica
      if (!formData.name || !formData.targetAmount || !formData.deadline) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Calcular porcentagem
      const current = parseFloat(formData.currentAmount) || 0;
      const target = parseFloat(formData.targetAmount);
      const percentage = (current / target) * 100;

      const goalData = {
        id: Date.now(), // ID temporário
        name: formData.name,
        category: formData.category,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: current,
        deadline: formData.deadline,
        percentage: percentage.toFixed(1)
      };

      onSaveGoal(goalData);
      
      // Limpar formulário
      setFormData({
        name: '',
        category: 'Imóvel',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
      });
      
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Nova Meta Financeira</h3>
            <button
              onClick={onClose}
              className={styles.closeButton}
            >
              <X className={styles.closeIcon} />
            </button>
          </div>
          <div className={styles.modalBody}>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {/* Nome da Meta */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Nome da Meta <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Casa Própria"
                  className={styles.input}
                  required
                />
              </div>

              {/* Categoria */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Categoria <span className={styles.required}>*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={styles.input}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Valor Objetivo */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Valor Objetivo (R$) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  placeholder="150000.00"
                  step="0.01"
                  min="0"
                  className={styles.input}
                  required
                />
              </div>

              {/* Valor Atual */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Valor Atual (R$)
                </label>
                <input
                  type="number"
                  name="currentAmount"
                  value={formData.currentAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={styles.input}
                />
              </div>

              {/* Prazo */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Prazo <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              {/* Botões */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                >
                  Salvar Meta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Componente NewBillModal integrado
  const NewBillModal = ({ isOpen, onClose, onSaveBill }) => {
    const [formData, setFormData] = useState({
      name: '',
      amount: '',
      dueDate: '',
      category: 'Moradia',
      status: 'Pendente',
    });

    const categories = [
      'Moradia',
      'Alimentação',
      'Transporte',
      'Saúde',
      'Educação',
      'Lazer',
      'Serviços',
      'Outros'
    ];

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Validação básica
      if (!formData.name || !formData.amount || !formData.dueDate) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      const billData = {
        id: Date.now(), // ID temporário
        name: formData.name,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        category: formData.category,
        status: formData.status
      };

      onSaveBill(billData);
      
      // Limpar formulário
      setFormData({
        name: '',
        amount: '',
        dueDate: '',
        category: 'Moradia',
        status: 'Pendente',
      });
      
      onClose();
    };

    if (!isOpen) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Nova Conta/Despesa</h3>
            <button
              onClick={onClose}
              className={styles.closeButton}
            >
              <X className={styles.closeIcon} />
            </button>
          </div>
          <div className={styles.modalBody}>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {/* Nome da Conta */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Nome da Conta <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ex: Aluguel"
                  className={styles.input}
                  required
                />
              </div>

              {/* Categoria */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Categoria <span className={styles.required}>*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={styles.input}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Valor */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Valor (R$) <span className={styles.required}>*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="1200.00"
                  step="0.01"
                  min="0"
                  className={styles.input}
                  required
                />
              </div>

              {/* Data de Vencimento */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Data de Vencimento <span className={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              {/* Status */}
              <div className={styles.formField}>
                <label className={styles.label}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Pago">Pago</option>
                  <option value="Atrasado">Atrasado</option>
                </select>
              </div>

              {/* Botões */}
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={onClose}
                  className={styles.cancelButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.saveButton}
                >
                  Salvar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveNewGoal = (goalData) => {
    console.log('Nova meta salva:', goalData);
    
    // Adicionar meta ao Dashboard
    if (window.dashboardHandlers && window.dashboardHandlers.addGoal) {
      window.dashboardHandlers.addGoal(goalData);
    }
  };

  const handleSaveNewBill = (billData) => {
    console.log('Nova conta/despesa salva:', billData);
    
    // Adicionar conta ao Dashboard
    if (window.dashboardHandlers && window.dashboardHandlers.addBill) {
      window.dashboardHandlers.addBill(billData);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header - Largura total */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* LOGO + TEXTO */}
          <motion.div
            className={styles.logoContainer}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="../src/assets/Img/LOTUS 9 1.png"
              alt="Logo Prospera"
              className={styles.logo}
            />
            <h1 className={styles.logoText}>
              Prospera
            </h1>
          </motion.div>

          {/* PERFIL + BOTÃO SAIR */}
          <motion.div
            className={styles.userContainer}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {getUserAvatar().type === 'image' ? (
                  <img 
                    src={getUserAvatar().content} 
                    alt="Foto do usuário" 
                    className={styles.userAvatarImage}
                  />
                ) : (
                  <span className={styles.userInitial}>{getUserAvatar().content}</span>
                )}
              </div>
              <span className={styles.userName}>
                {user?.name || 'Usuário'}
              </span>
            </div>

            <button
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              <LogOut className={styles.logoutIcon} />
              Sair
            </button>
          </motion.div>
        </div>
      </header>

      {/* Main Content - Largura total sem limites */}
      <main className={styles.main}>
        <div className={styles.tabsContainer}>
          {/* Navigation Tabs - Largura total */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={styles.tabsWrapper}
          >
            <div className={styles.tabsList}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  value={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${styles.tabTrigger} ${activeTab === tab.id ? styles.tabActive : ''}`}
                >
                  <tab.icon className={styles.tabIcon} />
                  <span className={styles.tabLabel}>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content - Largura total */}
          <div className={styles.tabContent}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={styles.contentWrapper}
            >
              {activeTab === 'dashboard' ? (
                <Dashboard
                  openNewGoalModal={() => setIsNewGoalModalOpen(true)}
                  openNewBillModal={() => setIsNewBillModalOpen(true)}
                />
              ) : (
                (() => {
                  const TabComponent = tabs.find(tab => tab.id === activeTab)?.component;
                  return TabComponent ? <TabComponent /> : null;
                })()
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <NewGoalModal
        isOpen={isNewGoalModalOpen}
        onClose={() => setIsNewGoalModalOpen(false)}
        onSaveGoal={handleSaveNewGoal}
      />
      <NewBillModal
        isOpen={isNewBillModalOpen}
        onClose={() => setIsNewBillModalOpen(false)}
        onSaveBill={handleSaveNewBill}
      />
    </div>
  );
}

export default UserPage;