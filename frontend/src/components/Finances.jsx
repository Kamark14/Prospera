// Finances.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, Wallet, TrendingUp, TrendingDown, 
  Search, Edit, Trash2, 
  ArrowUpRight, ArrowDownRight, Eye, EyeOff, Save, X,
  Utensils, Car, Home, Heart, BookOpen,
  Coffee, GraduationCap, GamepadIcon, ShoppingCart,
  DollarSign, TrendingUp as TrendingUpIcon
} from 'lucide-react'
import styles from '../styles/Finances.module.css'

const Finances = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showValues, setShowValues] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: 'income',
      description: 'Salário',
      amount: 5500,
      date: '2023-12-31',
      category: 'salario'
    },
    {
      id: 2,
      type: 'expense',
      description: 'Supermercado',
      amount: 350,
      date: '2024-01-01',
      category: 'alimentacao'
    },
    {
      id: 3,
      type: 'expense',
      description: 'Combustível',
      amount: 200,
      date: '2024-01-02',
      category: 'transporte'
    },
    {
      id: 4,
      type: 'income',
      description: 'Freelance',
      amount: 800,
      date: '2024-01-03',
      category: 'freelance'
    },
    {
      id: 5,
      type: 'expense',
      description: 'Aluguel',
      amount: 1200,
      date: '2024-01-04',
      category: 'moradia'
    }
  ])

  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: ''
  })

  const [editTransaction, setEditTransaction] = useState({
    type: '',
    description: '',
    amount: '',
    date: '',
    category: ''
  })

  const categories = {
    income: [
      { value: 'salario', label: 'Salário', icon: GraduationCap },
      { value: 'freelance', label: 'Freelance', icon: Coffee },
      { value: 'investimentos', label: 'Investimentos', icon: TrendingUpIcon },
      { value: 'outros', label: 'Outras Receitas', icon: DollarSign }
    ],
    expense: [
      { value: 'alimentacao', label: 'Alimentação', icon: Utensils },
      { value: 'transporte', label: 'Transporte', icon: Car },
      { value: 'moradia', label: 'Moradia', icon: Home },
      { value: 'saude', label: 'Saúde', icon: Heart },
      { value: 'educacao', label: 'Educação', icon: BookOpen },
      { value: 'lazer', label: 'Lazer', icon: GamepadIcon },
      { value: 'outras', label: 'Outras Despesas', icon: ShoppingCart }
    ]
  }

  const formatCurrency = (value) => {
    if (!showValues) return 'R$ •••••'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getCategoryLabel = (category) => {
    const allCategories = [...categories.income, ...categories.expense]
    const found = allCategories.find(cat => cat.value === category)
    return found ? found.label : category
  }

  const getCategoryIcon = (category) => {
    const allCategories = [...categories.income, ...categories.expense]
    const found = allCategories.find(cat => cat.value === category)
    return found ? found.icon : DollarSign
  }

  const getTypeColor = (type) => {
    return type === 'income' ? styles.incomeColor : styles.expenseColor
  }

  const getTypeIcon = (type) => {
    return type === 'income' ? ArrowUpRight : ArrowDownRight
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory
    return matchesSearch && matchesType && matchesCategory
  })

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      alert('Por favor, preencha todos os campos obrigatórios!')
      return
    }

    const transaction = {
      id: Date.now(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount)
    }

    setTransactions(prev => [transaction, ...prev])
    setNewTransaction({
      type: 'expense',
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: ''
    })
    setIsAddModalOpen(false)
  }

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
  }

  const handleStartEdit = (transaction) => {
    setEditingId(transaction.id)
    setEditTransaction({
      type: transaction.type,
      description: transaction.description,
      amount: transaction.amount.toString(),
      date: transaction.date,
      category: transaction.category
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTransaction({
      type: '',
      description: '',
      amount: '',
      date: '',
      category: ''
    })
  }

  const handleSaveEdit = () => {
    if (!editTransaction.description || !editTransaction.amount || !editTransaction.category) {
      alert('Por favor, preencha todos os campos obrigatórios!')
      return
    }

    setTransactions(prev => prev.map(t => 
      t.id === editingId 
        ? { ...t, ...editTransaction, amount: parseFloat(editTransaction.amount) }
        : t
    ))
    handleCancelEdit()
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Minhas Finanças</h2>
          <p className={styles.subtitle}>Gerencie suas receitas e despesas</p>
        </div>
        
        <div className={styles.headerActions}>
          <button
            className={styles.toggleButton}
            onClick={() => setShowValues(!showValues)}
          >
            {showValues ? <EyeOff className={styles.buttonIcon} /> : <Eye className={styles.buttonIcon} />}
            {showValues ? 'Ocultar' : 'Mostrar'} Valores
          </button>
          
          <button
            className={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className={styles.buttonIcon} />
            Nova Transação
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        className={styles.cardsGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={`${styles.card} ${styles.incomeCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleIncome}>Total de Receitas</div>
            <TrendingUp className={styles.cardIconIncome} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardValueIncome}>{formatCurrency(totalIncome)}</div>
            <p className={styles.cardInfoIncome}>
              {transactions.filter(t => t.type === 'income').length} transação(ões)
            </p>
          </div>
        </div>

        <div className={`${styles.card} ${styles.expenseCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitleExpense}>Total de Despesas</div>
            <TrendingDown className={styles.cardIconExpense} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardValueExpense}>{formatCurrency(totalExpenses)}</div>
            <p className={styles.cardInfoExpense}>
              {transactions.filter(t => t.type === 'expense').length} transação(ões)
            </p>
          </div>
        </div>

        <div className={`${styles.card} ${balance >= 0 ? styles.balanceCardPositive : styles.balanceCardNegative}`}>
          <div className={styles.cardHeader}>
            <div className={balance >= 0 ? styles.cardTitleBalancePositive : styles.cardTitleBalanceNegative}>
              Saldo
            </div>
            <Wallet className={balance >= 0 ? styles.cardIconBalancePositive : styles.cardIconBalanceNegative} />
          </div>
          <div className={styles.cardContent}>
            <div className={balance >= 0 ? styles.cardValueBalancePositive : styles.cardValueBalanceNegative}>
              {formatCurrency(balance)}
            </div>
            <p className={balance >= 0 ? styles.cardInfoBalancePositive : styles.cardInfoBalanceNegative}>
              {balance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className={styles.filtersContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className={styles.searchContainer}>
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        
        <div className={styles.selectWrapper}>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Apenas receitas</option>
            <option value="expense">Apenas despesas</option>
          </select>
        </div>

        <div className={styles.selectWrapper}>
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Todas as categorias</option>
            {[...categories.income, ...categories.expense].map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h3 className={styles.tableTitle}>Histórico de Transações</h3>
            <p className={styles.tableDescription}>
              {filteredTransactions.length} transação(ões) encontrada(s)
            </p>
          </div>
          <div className={styles.tableContent}>
            <table className={styles.table}>
              <thead>
                <tr className={styles.tableHeaderRow}>
                  <th className={styles.tableHead}>Tipo</th>
                  <th className={styles.tableHead}>Descrição</th>
                  <th className={styles.tableHead}>Categoria</th>
                  <th className={styles.tableHead}>Data</th>
                  <th className={`${styles.tableHead} ${styles.textRight}`}>Valor</th>
                  <th className={`${styles.tableHead} ${styles.textRight}`}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => {
                  const TypeIcon = getTypeIcon(transaction.type)
                  const CategoryIcon = getCategoryIcon(transaction.category)
                  const isEditing = editingId === transaction.id

                  if (isEditing) {
                    return (
                      <tr key={transaction.id} className={styles.editingRow}>
                        <td className={styles.tableCell}>
                          <select 
                            value={editTransaction.type} 
                            onChange={(e) => setEditTransaction(prev => ({ ...prev, type: e.target.value, category: '' }))}
                            className={styles.editSelect}
                          >
                            <option value="income">Receita</option>
                            <option value="expense">Despesa</option>
                          </select>
                        </td>
                        <td className={styles.tableCell}>
                          <input
                            type="text"
                            value={editTransaction.description}
                            onChange={(e) => setEditTransaction(prev => ({ ...prev, description: e.target.value }))}
                            className={styles.editInput}
                          />
                        </td>
                        <td className={styles.tableCell}>
                          <select 
                            value={editTransaction.category} 
                            onChange={(e) => setEditTransaction(prev => ({ ...prev, category: e.target.value }))}
                            className={styles.editSelect}
                          >
                            {categories[editTransaction.type].map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className={styles.tableCell}>
                          <input
                            type="date"
                            value={editTransaction.date}
                            onChange={(e) => setEditTransaction(prev => ({ ...prev, date: e.target.value }))}
                            className={styles.editInput}
                          />
                        </td>
                        <td className={`${styles.tableCell} ${styles.textRight}`}>
                          <input
                            type="number"
                            step="0.01"
                            value={editTransaction.amount}
                            onChange={(e) => setEditTransaction(prev => ({ ...prev, amount: e.target.value }))}
                            className={`${styles.editInput} ${styles.amountInput}`}
                          />
                        </td>
                        <td className={`${styles.tableCell} ${styles.textRight}`}>
                          <div className={styles.actionButtons}>
                            <button 
                              onClick={handleSaveEdit}
                              className={styles.saveButton}
                            >
                              <Save className={styles.actionIcon} />
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className={styles.cancelEditButton}
                            >
                              <X className={styles.actionIcon} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  }

                  return (
                    <tr key={transaction.id} className={styles.tableRow}>
                      <td className={styles.tableCell}>
                        <div className={styles.typeCell}>
                          <TypeIcon className={`${styles.typeIcon} ${getTypeColor(transaction.type)}`} />
                          <span className={`${styles.typeBadge} ${transaction.type === 'income' ? styles.incomeBadge : styles.expenseBadge}`}>
                            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                          </span>
                        </div>
                      </td>
                      <td className={`${styles.tableCell} ${styles.descriptionCell}`}>
                        {transaction.description}
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.categoryBadge}>
                          <CategoryIcon className={styles.categoryIcon} />
                          {getCategoryLabel(transaction.category)}
                        </div>
                      </td>
                      <td className={styles.tableCell}>
                        {new Date(transaction.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className={`${styles.tableCell} ${styles.textRight} ${styles.amountCell} ${getTypeColor(transaction.type)}`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className={`${styles.tableCell} ${styles.textRight}`}>
                        <div className={styles.actionButtons}>
                          <button 
                            onClick={() => handleStartEdit(transaction)}
                            className={styles.editButton}
                          >
                            <Edit className={styles.actionIcon} />
                          </button>
                          <button 
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className={styles.deleteButton}
                          >
                            <Trash2 className={styles.actionIcon} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <motion.div
            className={styles.modalContent}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Adicionar Transação</h3>
              <p className={styles.modalDescription}>
                Registre uma nova receita ou despesa
              </p>
              <button 
                className={styles.closeButton}
                onClick={() => setIsAddModalOpen(false)}
              >
                <X className={styles.closeIcon} />
              </button>
            </div>
            
            <div className={styles.modalForm}>
              <div className={styles.formField}>
                <label className={styles.label}>Tipo</label>
                <select 
                  value={newTransaction.type} 
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, type: e.target.value, category: '' }))}
                  className={styles.selectInput}
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Descrição</label>
                <input
                  type="text"
                  placeholder="Ex: Salário, Supermercado, Combustível..."
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                  className={styles.textInput}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formField}>
                  <label className={styles.label}>Valor</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                    className={styles.textInput}
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.label}>Data</label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                    className={styles.textInput}
                  />
                </div>
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Categoria</label>
                <select 
                  value={newTransaction.category} 
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, category: e.target.value }))}
                  className={styles.selectInput}
                >
                  <option value="">Selecione uma categoria</option>
                  {categories[newTransaction.type].map((category) => {
                    const IconComponent = category.icon
                    return (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    )
                  })}
                </select>
                
                {/* Category Icons Preview */}
                <div className={styles.categoryIconsPreview}>
                  {categories[newTransaction.type].map((category) => {
                    const IconComponent = category.icon
                    return (
                      <div 
                        key={category.value}
                        className={`${styles.categoryIconOption} ${newTransaction.category === category.value ? styles.categoryIconActive : ''}`}
                        onClick={() => setNewTransaction(prev => ({ ...prev, category: category.value }))}
                      >
                        <IconComponent className={styles.categoryPreviewIcon} />
                        <span>{category.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancelar
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={handleAddTransaction}
                >
                  Adicionar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Finances