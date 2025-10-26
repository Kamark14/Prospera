// Goals.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Target, Plus, Home, Plane, GraduationCap, Shield,
  Smartphone, Wrench, TrendingUp, Heart,
  Calendar, Edit, Trash2, MapPin, Building,
  Bed, Car, Gift, Users, BookOpen, Briefcase
} from 'lucide-react'

import styles from '../styles/Goals.module.css'

const Goals = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Apartamento Centro',
      category: 'Imóvel',
      target: 150000,
      current: 45000,
      deadline: '2025-12-31',
      details: {
        type: 'Apartamento',
        location: 'Centro',
        rooms: 2
      }
    },
    {
      id: 2,
      title: 'Viagem Europa',
      category: 'Viagem',
      target: 15000,
      current: 8500,
      deadline: '2024-07-15',
      details: {
        destination: 'Europa',
        travelers: 2,
        duration: 15
      }
    }
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddValueModalOpen, setIsAddValueModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [currentStep, setCurrentStep] = useState('category')
  const [editingGoal, setEditingGoal] = useState(null)
  const [addValueGoal, setAddValueGoal] = useState(null)
  const [deletingGoal, setDeletingGoal] = useState(null)
  const [valueToAdd, setValueToAdd] = useState('')

  const [newGoal, setNewGoal] = useState({
    title: '',
    category: '',
    target: '',
    current: '0',
    deadline: '',
    details: {}
  })

  // Controlar scroll do body quando modal estiver aberto
  useEffect(() => {
    if (isModalOpen || isEditModalOpen || isAddValueModalOpen || isDeleteModalOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isModalOpen, isEditModalOpen, isAddValueModalOpen, isDeleteModalOpen])

  const goalCategories = [
    // No array goalCategories, atualize a categoria Imóvel:
    {
      id: 'imovel',
      name: 'Imóvel',
      icon: Home,
      description: 'Casa, apartamento, terreno',
      color: 'blue',
      placeholder: 'Ex: Apartamento Centro',
      suggestedValue: 150000,
      fields: [
        {
          name: 'type',
          label: 'Tipo do Imóvel',
          type: 'select',
          options: [
            { value: 'casa', label: 'Casa' },
            { value: 'apartamento', label: 'Apartamento' },
            { value: 'terreno', label: 'Terreno' },
            { value: 'comercial', label: 'Comercial' }
          ]
        },
        {
          name: 'location',
          label: 'Localização',
          type: 'text',
          placeholder: 'Ex: Centro, Bairro X'
        },
        {
          name: 'area',
          label: 'Metragem (m²)',
          type: 'number',
          placeholder: 'Ex: 80'
        },
        {
          name: 'rooms',
          label: 'Quartos',
          type: 'number',
          placeholder: 'Número de quartos'
        }
      ]
    },
    {
      id: 'viagem',
      name: 'Viagem',
      icon: Plane,
      description: 'Férias, mochilão, turismo',
      color: 'green',
      placeholder: 'Ex: Viagem Europa',
      suggestedValue: 15000,
      fields: [
        {
          name: 'destination',
          label: 'Destino',
          type: 'text',
          placeholder: 'Ex: Europa, Nordeste'
        },
        {
          name: 'travelers',
          label: 'Viajantes',
          type: 'number',
          placeholder: 'Número de pessoas'
        },
        {
          name: 'duration',
          label: 'Duração (dias)',
          type: 'number',
          placeholder: 'Dias de viagem'
        }
      ]
    },
    {
      id: 'educacao',
      name: 'Educação',
      icon: GraduationCap,
      description: 'Cursos, graduação, pós',
      color: 'purple',
      placeholder: 'Ex: Faculdade de Engenharia',
      suggestedValue: 50000,
      fields: [
        {
          name: 'course',
          label: 'Curso/Formação',
          type: 'text',
          placeholder: 'Ex: Engenharia, Medicina'
        },
        {
          name: 'institution',
          label: 'Instituição',
          type: 'text',
          placeholder: 'Ex: USP, UNIFESP'
        },
        {
          name: 'duration',
          label: 'Duração (anos)',
          type: 'number',
          placeholder: 'Anos de duração'
        }
      ]
    },
    {
      id: 'emergencia',
      name: 'Fundo de Emergência',
      icon: Shield,
      description: 'Reserva para imprevistos',
      color: 'red',
      placeholder: 'Ex: Reserva Emergencial',
      suggestedValue: 20000,
      fields: [
        {
          name: 'coverage',
          label: 'Cobertura',
          type: 'select',
          options: [
            { value: '3meses', label: '3 meses de despesas' },
            { value: '6meses', label: '6 meses de despesas' },
            { value: '12meses', label: '12 meses de despesas' }
          ]
        },
        {
          name: 'purpose',
          label: 'Finalidade Principal',
          type: 'text',
          placeholder: 'Ex: Saúde, Manutenção'
        }
      ]
    },
    {
      id: 'eletronicos',
      name: 'Eletrônicos',
      icon: Smartphone,
      description: 'Smartphone, notebook, TV',
      color: 'indigo',
      placeholder: 'Ex: iPhone 15 Pro',
      suggestedValue: 8000,
      fields: [
        {
          name: 'device',
          label: 'Dispositivo',
          type: 'select',
          options: [
            { value: 'smartphone', label: 'Smartphone' },
            { value: 'notebook', label: 'Notebook' },
            { value: 'tablet', label: 'Tablet' },
            { value: 'tv', label: 'TV' },
            { value: 'outro', label: 'Outro' }
          ]
        },
        {
          name: 'brand',
          label: 'Marca/Modelo',
          type: 'text',
          placeholder: 'Ex: iPhone 15, Samsung S23'
        }
      ]
    },
    {
      id: 'reforma',
      name: 'Reforma',
      icon: Wrench,
      description: 'Melhorias na casa',
      color: 'orange',
      placeholder: 'Ex: Reforma Cozinha',
      suggestedValue: 25000,
      fields: [
        {
          name: 'area',
          label: 'Área da Reforma',
          type: 'select',
          options: [
            { value: 'cozinha', label: 'Cozinha' },
            { value: 'banheiro', label: 'Banheiro' },
            { value: 'quarto', label: 'Quarto' },
            { value: 'sala', label: 'Sala' },
            { value: 'externa', label: 'Área Externa' }
          ]
        },
        {
          name: 'scope',
          label: 'Escopo',
          type: 'text',
          placeholder: 'Ex: Pintura, Elétrica, Hidráulica'
        }
      ]
    },
    {
      id: 'investimento',
      name: 'Investimento',
      icon: TrendingUp,
      description: 'Negócio, startup, ações',
      color: 'yellow',
      placeholder: 'Ex: Abertura de Empresa',
      suggestedValue: 50000,
      fields: [
        {
          name: 'type',
          label: 'Tipo de Investimento',
          type: 'select',
          options: [
            { value: 'negocio', label: 'Negócio Próprio' },
            { value: 'acoes', label: 'Ações' },
            { value: 'fiis', label: 'Fundos Imobiliários' },
            { value: 'cripto', label: 'Criptomoedas' }
          ]
        },
        {
          name: 'segment',
          label: 'Segmento',
          type: 'text',
          placeholder: 'Ex: Tecnologia, Varejo'
        }
      ]
    },
    {
      id: 'familia',
      name: 'Família',
      icon: Heart,
      description: 'Filhos, casamento, pet',
      color: 'pink',
      placeholder: 'Ex: Casamento',
      suggestedValue: 30000,
      fields: [
        {
          name: 'occasion',
          label: 'Ocasião',
          type: 'select',
          options: [
            { value: 'casamento', label: 'Casamento' },
            { value: 'nascimento', label: 'Nascimento' },
            { value: 'formatura', label: 'Formatura' },
            { value: 'aniversario', label: 'Aniversário' }
          ]
        },
        {
          name: 'participants',
          label: 'Número de Pessoas',
          type: 'number',
          placeholder: 'Convidados/familiares'
        }
      ]
    }
  ]

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  const getCategoryColor = (categoryName) => {
    const category = goalCategories.find(cat => cat.name === categoryName)
    return category ? category.color : 'gray'
  }

  const getCategoryIcon = (categoryName) => {
    const category = goalCategories.find(cat => cat.name === categoryName)
    return category ? category.icon : Target
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setNewGoal(prev => ({
      ...prev,
      category: category.name,
      target: category.suggestedValue.toString(),
      details: {}
    }))
    setCurrentStep('details')
  }

  const resetModal = () => {
    setCurrentStep('category')
    setSelectedCategory(null)
    setNewGoal({
      title: '',
      category: '',
      target: '',
      current: '0',
      deadline: '',
      details: {}
    })
    setIsModalOpen(false)
  }

  const handleDetailChange = (fieldName, value) => {
    setNewGoal(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [fieldName]: value
      }
    }))
  }

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const goal = {
      id: Date.now(),
      title: newGoal.title,
      category: newGoal.category,
      target: parseFloat(newGoal.target),
      current: parseFloat(newGoal.current) || 0,
      deadline: newGoal.deadline,
      details: newGoal.details
    }

    setGoals(prev => [...prev, goal])
    resetModal()
  }

  const handleEditGoal = (goal) => {
    setEditingGoal({
      ...goal,
      target: goal.target.toString(),
      current: goal.current.toString()
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingGoal.title || !editingGoal.target || !editingGoal.deadline) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setGoals(prev => prev.map(g =>
      g.id === editingGoal.id
        ? {
          ...g,
          title: editingGoal.title,
          category: editingGoal.category,
          target: parseFloat(editingGoal.target),
          current: parseFloat(editingGoal.current),
          deadline: editingGoal.deadline
        }
        : g
    ))
    setIsEditModalOpen(false)
    setEditingGoal(null)
  }

  const handleOpenDelete = (goal) => {
    setDeletingGoal(goal)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteGoal = () => {
    setGoals(prev => prev.filter(g => g.id !== deletingGoal.id))
    setIsDeleteModalOpen(false)
    setDeletingGoal(null)
  }

  const handleOpenAddValue = (goal) => {
    setAddValueGoal(goal)
    setValueToAdd('')
    setIsAddValueModalOpen(true)
  }

  const handleAddValue = () => {
    const value = parseFloat(valueToAdd)
    if (isNaN(value) || value <= 0) {
      alert('Por favor, insira um valor válido')
      return
    }

    setGoals(prev => prev.map(g =>
      g.id === addValueGoal.id
        ? { ...g, current: Math.min(g.current + value, g.target) }
        : g
    ))
    setIsAddValueModalOpen(false)
    setAddValueGoal(null)
    setValueToAdd('')
  }

  const handleOverlayClick = (e, modalType) => {
    if (e.target === e.currentTarget) {
      if (modalType === 'create') resetModal()
      else if (modalType === 'edit') setIsEditModalOpen(false)
      else if (modalType === 'addValue') setIsAddValueModalOpen(false)
      else if (modalType === 'delete') setIsDeleteModalOpen(false)
    }
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#10b981'
    if (percentage >= 75) return '#3b82f6'
    if (percentage >= 50) return '#f59e0b'
    if (percentage >= 25) return '#f97316'
    return '#ef4444'
  }

  const renderDetailField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            className={styles.input}
            value={newGoal.details[field.name] || ''}
            onChange={(e) => handleDetailChange(field.name, e.target.value)}
          >
            <option value="">Selecione...</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case 'number':
        return (
          <input
            className={styles.input}
            type="number"
            placeholder={field.placeholder}
            value={newGoal.details[field.name] || ''}
            onChange={(e) => handleDetailChange(field.name, e.target.value)}
          />
        )
      default:
        return (
          <input
            className={styles.input}
            type="text"
            placeholder={field.placeholder}
            value={newGoal.details[field.name] || ''}
            onChange={(e) => handleDetailChange(field.name, e.target.value)}
          />
        )
    }
  }

  const renderGoalDetails = (goal) => {
    const category = goalCategories.find(cat => cat.name === goal.category)
    if (!category || !goal.details) return null

    return (
      <div className={styles.goalDetailsExtra}>
        {category.fields.map(field => (
          goal.details[field.name] && (
            <div key={field.name} className={styles.detailItem}>
              <span className={styles.detailLabel}>{field.label}:</span>
              <span className={styles.detailValue}>{goal.details[field.name]}</span>
            </div>
          )
        ))}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Minhas Metas</h1>
          <p className={styles.subtitle}>Defina e acompanhe seus objetivos financeiros</p>
        </div>

        <motion.button
          className={styles.newGoalButton}
          onClick={() => setIsModalOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className={styles.plusIcon} />
          Nova Meta
        </motion.button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className={styles.emptyState}>
          <Target className={styles.emptyIcon} />
          <h3>Nenhuma meta criada</h3>
          <p>Comece criando sua primeira meta financeira</p>
          <button
            className={styles.emptyButton}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className={styles.plusIcon} />
            Criar Primeira Meta
          </button>
        </div>
      ) : (
        <div className={styles.goalsGrid}>
          {goals.map((goal) => {
            const progress = calculateProgress(goal.current, goal.target)
            const progressColor = getProgressColor(progress)
            const CategoryIcon = getCategoryIcon(goal.category)
            const categoryColor = getCategoryColor(goal.category)

            return (
              <motion.div
                key={goal.id}
                className={styles.goalCard}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.goalHeader}>
                  <div className={styles.titleSection}>
                    <div className={`${styles.categoryIcon} ${styles[categoryColor]}`}>
                      <CategoryIcon className={styles.categoryIconSvg} />
                    </div>
                    <div className={styles.titleContent}>
                      <h3 className={styles.goalTitle}>{goal.title}</h3>
                      <span className={styles.goalCategory}>{goal.category}</span>
                    </div>
                  </div>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleOpenDelete(goal)}
                    title="Excluir meta"
                  >
                    <Trash2 className={styles.trashIcon} />
                  </button>
                </div>

                {renderGoalDetails(goal)}

                <div className={styles.progressSection}>
                  <div
                    className={styles.progressPercentage}
                    style={{ color: progressColor }}
                  >
                    {progress.toFixed(1)}%
                  </div>
                  <div className={styles.progressLabel}>concluído</div>
                </div>

                <div className={styles.progressContainer}>
                  <div className={styles.progressInfo}>
                    <span className={styles.progressText}>Progresso</span>
                    <span className={styles.progressAmount}>
                      {formatCurrency(goal.current)} de {formatCurrency(goal.target)}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressFill}
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progressColor
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className={styles.goalDetails}>
                  <div className={styles.deadline}>
                    <Calendar className={styles.calendarIcon} />
                    <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className={styles.remaining}>
                    Faltam: {formatCurrency(goal.target - goal.current)}
                  </div>
                </div>

                <div className={styles.actionButtons}>
                  <motion.button
                    className={styles.editButton}
                    onClick={() => handleEditGoal(goal)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Edit className={styles.buttonIcon} />
                    Editar
                  </motion.button>
                  <motion.button
                    className={styles.addValueButton}
                    onClick={() => handleOpenAddValue(goal)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className={styles.buttonIcon} />
                    Adicionar Valor
                  </motion.button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {isModalOpen && (
        <motion.div
          className={styles.modalOverlay}
          onClick={(e) => handleOverlayClick(e, 'create')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                <Target className={styles.targetIcon} />
                Criar Nova Meta
              </h2>
              <p className={styles.modalDescription}>
                {currentStep === 'category' && 'Escolha a categoria da sua meta financeira'}
                {currentStep === 'details' && `Configure os detalhes da sua meta de ${selectedCategory?.name}`}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {currentStep === 'category' && (
                <motion.div
                  key="category"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={styles.categoryGrid}
                >
                  {goalCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className={styles.categoryCard}
                        onClick={() => handleCategorySelect(category)}
                      >
                        <div className={`${styles.categoryIcon} ${styles[category.color]}`}>
                          <category.icon className={styles.categoryIconSvg} />
                        </div>
                        <div className={styles.categoryContent}>
                          <h3 className={styles.categoryName}>{category.name}</h3>
                          <p className={styles.categoryDescription}>{category.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {currentStep === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className={styles.detailsStep}
                >
                  <div className={styles.backSection}>
                    <button
                      className={styles.backButton}
                      onClick={() => setCurrentStep('category')}
                    >
                      ← Voltar
                    </button>
                    <div className={styles.categoryHeader}>
                      <div className={`${styles.selectedCategoryIcon} ${styles[selectedCategory?.color]}`}>
                        <selectedCategory.icon className={styles.selectedCategoryIconSvg} />
                      </div>
                      <span className={styles.selectedCategoryName}>{selectedCategory?.name}</span>
                    </div>
                  </div>

                  <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Nome da Meta</label>
                      <input
                        className={styles.input}
                        placeholder={selectedCategory?.placeholder}
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>

                    {/* Campos específicos da categoria */}
                    {selectedCategory?.fields && (
                      <>
                        <div className={styles.separator} />
                        <div className={styles.categoryFields}>
                          <h4 className={styles.fieldsTitle}>Detalhes da Meta</h4>
                          {selectedCategory.fields.map((field) => (
                            <div key={field.name} className={styles.formGroup}>
                              <label className={styles.label}>{field.label}</label>
                              {renderDetailField(field)}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <div className={styles.separator} />

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Valor Total da Meta</label>
                        <input
                          className={styles.input}
                          type="number"
                          placeholder="Ex: 50000"
                          value={newGoal.target}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                        />
                        <div className={styles.suggestedValue}>
                          Sugerido: {formatCurrency(selectedCategory?.suggestedValue || 0)}
                        </div>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Valor Atual (Opcional)</label>
                        <input
                          className={styles.input}
                          type="number"
                          placeholder="Ex: 5000"
                          value={newGoal.current}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, current: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.label}>Data Alvo</label>
                      <input
                        className={styles.input}
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div className={styles.formActions}>
                      <button
                        className={styles.cancelButton}
                        onClick={resetModal}
                      >
                        Cancelar
                      </button>
                      <button
                        className={styles.createButton}
                        onClick={handleCreateGoal}
                      >
                        Criar Meta
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <motion.div
          className={styles.modalOverlay}
          onClick={(e) => handleOverlayClick(e, 'edit')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar Meta</h2>
              <p className={styles.modalDescription}>
                Atualize as informações da sua meta
              </p>
            </div>
            {editingGoal && (
              <div className={styles.formSection} style={{ padding: '1.5rem 2rem 2rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Nome da Meta</label>
                  <input
                    className={styles.input}
                    value={editingGoal.title}
                    onChange={(e) => setEditingGoal(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Categoria</label>
                  <select
                    className={styles.select}
                    value={editingGoal.category}
                    onChange={(e) => setEditingGoal(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {goalCategories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Valor Atual</label>
                    <input
                      className={styles.input}
                      type="number"
                      value={editingGoal.current}
                      onChange={(e) => setEditingGoal(prev => ({ ...prev, current: e.target.value }))}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Valor Meta</label>
                    <input
                      className={styles.input}
                      type="number"
                      value={editingGoal.target}
                      onChange={(e) => setEditingGoal(prev => ({ ...prev, target: e.target.value }))}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Data Alvo</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={editingGoal.deadline}
                    onChange={(e) => setEditingGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>

                <div className={styles.separator} />

                <div className={styles.formActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className={styles.saveButton}
                    onClick={handleSaveEdit}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Add Value Modal */}
      {isAddValueModalOpen && (
        <motion.div
          className={styles.modalOverlay}
          onClick={(e) => handleOverlayClick(e, 'addValue')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Adicionar Valor à Meta</h2>
              <p className={styles.modalDescription}>
                {addValueGoal && `Adicione um valor ao progresso de "${addValueGoal.title}"`}
              </p>
            </div>
            {addValueGoal && (
              <div className={styles.formSection} style={{ padding: '1.5rem 2rem 2rem' }}>
                <div className={styles.valuePreview}>
                  <div className={styles.previewRow}>
                    <span className={styles.previewLabel}>Valor Atual:</span>
                    <span className={styles.previewValue}>{formatCurrency(addValueGoal.current)}</span>
                  </div>
                  <div className={styles.previewRow}>
                    <span className={styles.previewLabel}>Valor Meta:</span>
                    <span className={styles.previewValue}>{formatCurrency(addValueGoal.target)}</span>
                  </div>
                  <div className={styles.previewRow}>
                    <span className={styles.previewLabel}>Falta:</span>
                    <span className={styles.remainingValue}>
                      {formatCurrency(addValueGoal.target - addValueGoal.current)}
                    </span>
                  </div>
                </div>

                <div className={styles.separator} />

                <div className={styles.formGroup}>
                  <label className={styles.label}>Valor a Adicionar (R$)</label>
                  <input
                    className={styles.input}
                    type="number"
                    step="0.01"
                    placeholder="Ex: 500.00"
                    value={valueToAdd}
                    onChange={(e) => setValueToAdd(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setIsAddValueModalOpen(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    className={styles.addValueModalButton}
                    onClick={handleAddValue}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <motion.div
          className={styles.modalOverlay}
          onClick={(e) => handleOverlayClick(e, 'delete')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.deleteModal}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles.modalHeader}>
              <div className={styles.deleteIcon}>
                <Trash2 className={styles.trashIconLarge} />
              </div>
              <h2 className={styles.modalTitle}>Excluir Meta</h2>
              <p className={styles.modalDescription}>
                Tem certeza que deseja excluir a meta "{deletingGoal?.title}"?
                Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className={styles.deleteActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className={styles.deleteConfirmButton}
                onClick={handleDeleteGoal}
              >
                Excluir Meta
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Goals