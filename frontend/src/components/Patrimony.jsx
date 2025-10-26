import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  TrendingUp, TrendingDown, Plus, Home, Car,
  Smartphone, Coins, CreditCard, Building, DollarSign,
  ArrowUpRight, ArrowDownRight, Calendar, Target,
  Download, Filter, Eye, EyeOff, RefreshCw, Edit, Trash2
} from 'lucide-react'
import styles from '../styles/Patrimony.module.css'

const Patrimony = () => {
  const [showValues, setShowValues] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const [patrimonyData, setPatrimonyData] = useState({
    goalNetWorth: 500000
  })

  const [assets, setAssets] = useState([
    {
      id: 1,
      name: 'Apartamento Centro',
      category: 'Imóvel',
      type: 'asset',
      value: 180000,
      variation: 2.5,
      lastUpdate: '2024-01-01',
      icon: Home,
      color: '#3B82F6'
    },
    {
      id: 2,
      name: 'Honda Civic 2020',
      category: 'Veículo',
      type: 'asset',
      value: 65000,
      variation: -3.2,
      lastUpdate: '2024-01-01',
      icon: Car,
      color: '#10B981'
    },
    {
      id: 3,
      name: 'Conta Corrente',
      category: 'Liquidez',
      type: 'asset',
      value: 15000,
      variation: 0,
      lastUpdate: '2024-01-01',
      icon: DollarSign,
      color: '#F59E0B'
    },
    {
      id: 4,
      name: 'Tesouro Selic',
      category: 'Investimento',
      type: 'asset',
      value: 25000,
      variation: 1.2,
      lastUpdate: '2024-01-01',
      icon: TrendingUp,
      color: '#8B5CF6'
    }
  ])

  const [liabilities, setLiabilities] = useState([
    {
      id: 5,
      name: 'Financiamento Imobiliário',
      category: 'Financiamento',
      type: 'liability',
      value: 95000,
      variation: -2.1,
      lastUpdate: '2024-01-01',
      icon: Building,
      color: '#EF4444'
    },
    {
      id: 6,
      name: 'Financiamento Veicular',
      category: 'Financiamento',
      type: 'liability',
      value: 25000,
      variation: -5.5,
      lastUpdate: '2024-01-01',
      icon: Car,
      color: '#F97316'
    },
    {
      id: 7,
      name: 'Cartão de Crédito',
      category: 'Dívida',
      type: 'liability',
      value: 5000,
      variation: 0,
      lastUpdate: '2024-01-01',
      icon: CreditCard,
      color: '#EC4899'
    }
  ])

  const [newItem, setNewItem] = useState({
    type: 'asset',
    category: '',
    name: '',
    value: ''
  })

  const [evolutionData] = useState([
    { month: 'Jul', value: 145000 },
    { month: 'Ago', value: 148000 },
    { month: 'Set', value: 152000 },
    { month: 'Out', value: 155000 },
    { month: 'Nov', value: 158000 },
    { month: 'Dez', value: 160000 }
  ])

  // Resto do código permanece igual...
  const getCategoryIcon = (category) => {
    const icons = {
      'Imóvel': Home,
      'Veículo': Car,
      'Liquidez': DollarSign,
      'Investimento': TrendingUp,
      'Financiamento': Building,
      'Dívida': CreditCard
    }
    return icons[category] || DollarSign
  }

  const formatCurrency = (value) => {
    if (!showValues) return 'R$ •••••'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatPercent = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getVariationColor = (variation) => {
    if (variation > 0) return styles.variationPositive
    if (variation < 0) return styles.variationNegative
    return 'text-gray-600'
  }

  const getVariationIcon = (variation) => {
    if (variation > 0) return ArrowUpRight
    if (variation < 0) return ArrowDownRight
    return null
  }

  const allItems = [...assets, ...liabilities]
  const filteredItems = selectedFilter === 'all' ? allItems : 
                       selectedFilter === 'assets' ? assets : liabilities

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0)
  const netWorth = totalAssets - totalLiabilities

  const assetCategories = assets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + asset.value
    return acc
  }, {})

  const pieData = Object.entries(assetCategories).map(([category, value], index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#F97316']
    return {
      name: category,
      value,
      color: colors[index % colors.length]
    }
  })

  const netWorthProgress = (netWorth / patrimonyData.goalNetWorth) * 100

  // Custom Tooltip para o gráfico de pizza
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{payload[0].name}</p>
          <p className={styles.tooltipValue}>{formatCurrency(payload[0].value)}</p>
          <p className={styles.tooltipPercent}>
            {((payload[0].value / totalAssets) * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  // Custom Tooltip para o gráfico de linha
  const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={styles.customTooltip}>
          <p className={styles.tooltipLabel}>{label}</p>
          <p className={styles.tooltipValue}>{formatCurrency(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  const handleAddItem = () => {
    if (!newItem.name || !newItem.value || !newItem.category) {
      alert('Por favor, preencha todos os campos')
      return
    }

    const item = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      type: newItem.type,
      value: parseFloat(newItem.value),
      variation: 0,
      lastUpdate: new Date().toISOString().split('T')[0],
      icon: getCategoryIcon(newItem.category),
      color: newItem.type === 'asset' ? '#3B82F6' : '#EF4444'
    }

    if (newItem.type === 'asset') {
      setAssets(prev => [...prev, item])
    } else {
      setLiabilities(prev => [...prev, item])
    }

    setNewItem({
      type: 'asset',
      category: '',
      name: '',
      value: ''
    })
    setIsAddModalOpen(false)
  }

  const handleEditItem = (item) => {
    setEditingItem({
      ...item,
      value: item.value.toString()
    })
    setIsEditModalOpen(true)
  }

  const handleSaveEdit = () => {
    if (!editingItem.name || !editingItem.value || !editingItem.category) {
      alert('Por favor, preencha todos os campos')
      return
    }

    const updatedItem = {
      ...editingItem,
      value: parseFloat(editingItem.value),
      icon: getCategoryIcon(editingItem.category)
    }

    if (editingItem.type === 'asset') {
      setAssets(prev => prev.map(a => a.id === editingItem.id ? updatedItem : a))
    } else {
      setLiabilities(prev => prev.map(l => l.id === editingItem.id ? updatedItem : l))
    }

    setIsEditModalOpen(false)
    setEditingItem(null)
  }

  const handleDeleteItem = (item) => {
    if (window.confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
      if (item.type === 'asset') {
        setAssets(prev => prev.filter(a => a.id !== item.id))
      } else {
        setLiabilities(prev => prev.filter(l => l.id !== item.id))
      }
    }
  }

  const getCategoriesByType = (type) => {
    if (type === 'asset') {
      return ['Imóvel', 'Veículo', 'Investimento', 'Liquidez', 'Outros']
    } else {
      return ['Financiamento', 'Dívida', 'Empréstimo', 'Outros']
    }
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
        <div>
          <h2 className={styles.title}>Patrimônio Acumulado</h2>
          <p className={styles.subtitle}>Visão completa dos seus ativos e passivos</p>
        </div>
        
        <div className={styles.headerControls}>
          <button
            className={styles.toggleButton}
            onClick={() => setShowValues(!showValues)}
          >
            {showValues ? <EyeOff className={styles.kpiIcon} /> : <Eye className={styles.kpiIcon} />}
            {showValues ? 'Ocultar' : 'Mostrar'} Valores
          </button>
          
          <button 
            className={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className={styles.kpiIcon} />
            Adicionar Item
          </button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        className={styles.kpisGrid}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={`${styles.kpiCard} ${styles.kpiBlue}`}>
          <div className={styles.kpiHeader}>
            <h3 className={styles.kpiTitle}>Patrimônio Líquido</h3>
            <TrendingUp className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>{formatCurrency(netWorth)}</div>
          <p className={styles.kpiDescription}>Ativos - Passivos</p>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiGreen}`}>
          <div className={styles.kpiHeader}>
            <h3 className={styles.kpiTitle}>Total de Ativos</h3>
            <Plus className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>{formatCurrency(totalAssets)}</div>
          <p className={styles.kpiDescription}>Tudo que você possui</p>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiRed}`}>
          <div className={styles.kpiHeader}>
            <h3 className={styles.kpiTitle}>Total de Passivos</h3>
            <TrendingDown className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>{formatCurrency(totalLiabilities)}</div>
          <p className={styles.kpiDescription}>Tudo que você deve</p>
        </div>

        <div className={`${styles.kpiCard} ${styles.kpiPurple}`}>
          <div className={styles.kpiHeader}>
            <h3 className={styles.kpiTitle}>Meta de Patrimônio</h3>
            <Target className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>{netWorthProgress.toFixed(1)}%</div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${netWorthProgress}%` }}
            ></div>
          </div>
          <p className={styles.kpiDescription}>de {formatCurrency(patrimonyData.goalNetWorth)}</p>
        </div>
      </motion.div>

      <div className={styles.chartsLayout}>
        {/* Composition Chart */}
        <motion.div
          className={styles.chartCard}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className={styles.chartHeader}>
            <PieChart className={styles.chartIcon} />
            <h3 className={styles.chartTitle}>Composição do Patrimônio</h3>
          </div>
          <p className={styles.chartDescription}>Distribuição dos seus ativos</p>
          
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className={styles.pieLegend}>
            {pieData.map((item, index) => (
              <div key={index} className={styles.legendItem}>
                <div className={styles.legendLabel}>
                  <div 
                    className={styles.legendColor} 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className={styles.legendValue}>{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Evolution Chart */}
        <motion.div
          className={styles.chartCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className={styles.chartHeader}>
            <TrendingUp className={styles.chartIcon} />
            <h3 className={styles.chartTitle}>Evolução do Patrimônio</h3>
          </div>
          <p className={styles.chartDescription}>Crescimento do patrimônio líquido nos últimos 6 meses</p>
          
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomLineTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#1D4ED8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
      {/* Items List */}
      <motion.div
        className={styles.itemsCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className={styles.itemsHeader}>
          <div>
            <h3 className={styles.itemsTitle}>Detalhamento Patrimonial</h3>
            <p className={styles.itemsDescription}>Lista completa de ativos e passivos</p>
          </div>
          <div>
            <select 
              className={styles.filterSelect}
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">Todos os itens</option>
              <option value="assets">Apenas ativos</option>
              <option value="liabilities">Apenas passivos</option>
            </select>
          </div>
        </div>
        
        <div className={styles.itemsList}>
          {filteredItems.map((item, index) => {
            const IconComponent = item.icon
            const VariationIcon = getVariationIcon(item.variation)
            
            return (
              <motion.div
                key={item.id}
                className={styles.itemCard}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className={styles.itemInfo}>
                  <div className={styles.itemIcon}>
                    <IconComponent />
                  </div>
                  <div>
                    <h4>{item.name}</h4>
                    <div className={styles.itemBadges}>
                      <span className={`${styles.badge} ${styles.badgeSecondary}`}>
                        {item.category}
                      </span>
                      <span className={`${styles.badge} ${
                        item.type === 'asset' ? styles.badgePrimary : styles.badgeDestructive
                      }`}>
                        {item.type === 'asset' ? 'Ativo' : 'Passivo'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.itemValues}>
                  <div className={styles.valueInfo}>
                    <div className={styles.valueAmount}>
                      {formatCurrency(item.value)}
                    </div>
                    {item.variation !== 0 && (
                      <div className={`${styles.variation} ${getVariationColor(item.variation)}`}>
                        {VariationIcon && <VariationIcon className={styles.variationIcon} />}
                        {formatPercent(item.variation)}
                      </div>
                    )}
                  </div>

                  <div className={styles.itemActions}>
                    <button 
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit />
                    </button>
                    <button 
                      className={`${styles.actionButton} ${styles.deleteButton}`}
                      onClick={() => handleDeleteItem(item)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Adicionar Ativo ou Passivo</h3>
              <p className={styles.modalDescription}>Adicione um novo item ao seu patrimônio</p>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tipo</label>
              <select 
                className={styles.formSelect}
                value={newItem.type}
                onChange={(e) => setNewItem(prev => ({ ...prev, type: e.target.value, category: '' }))}
              >
                <option value="asset">Ativo</option>
                <option value="liability">Passivo</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Categoria</label>
              <select 
                className={styles.formSelect}
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Selecione uma categoria</option>
                {getCategoriesByType(newItem.type).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome</label>
              <input 
                className={styles.formInput}
                placeholder="Ex: Apartamento, Carro, Investimento..."
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor Atual (R$)</label>
              <input 
                className={styles.formInput}
                type="number"
                step="0.01"
                placeholder="Ex: 150000"
                value={newItem.value}
                onChange={(e) => setNewItem(prev => ({ ...prev, value: e.target.value }))}
              />
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
                onClick={handleAddItem}
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingItem && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Editar Item Patrimonial</h3>
              <p className={styles.modalDescription}>Atualize as informações do item</p>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Tipo</label>
              <select 
                className={styles.formSelect}
                value={editingItem.type}
                onChange={(e) => setEditingItem(prev => ({ ...prev, type: e.target.value, category: '' }))}
              >
                <option value="asset">Ativo</option>
                <option value="liability">Passivo</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Categoria</label>
              <select 
                className={styles.formSelect}
                value={editingItem.category}
                onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
              >
                {getCategoriesByType(editingItem.type).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome</label>
              <input 
                className={styles.formInput}
                value={editingItem.name}
                onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Valor Atual (R$)</label>
              <input 
                className={styles.formInput}
                type="number"
                step="0.01"
                value={editingItem.value}
                onChange={(e) => setEditingItem(prev => ({ ...prev, value: e.target.value }))}
              />
            </div>

            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </button>
              <button 
                className={styles.confirmButton}
                onClick={handleSaveEdit}
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Patrimony