import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Download, Calendar, Filter, TrendingUp,
  TrendingDown, PieChart, BarChart3, LineChart,
  DollarSign, Target, CreditCard, Wallet, Eye,
  Settings, RefreshCw, Share2
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie,
  ComposedChart, Area, AreaChart
} from 'recharts'
import { generateReportPDF } from '../utils/generateReportPDF'
import styles from '../styles/Reports.module.css'

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [isGenerating, setIsGenerating] = useState(false)

  // Sample data - in a real app, this would come from your backend
  const [monthlyData] = useState([
    { month: 'Jan', receitas: 5500, despesas: 3200, saldo: 2300 },
    { month: 'Fev', receitas: 5800, despesas: 3400, saldo: 2400 },
    { month: 'Mar', receitas: 5200, despesas: 3800, saldo: 1400 },
    { month: 'Abr', receitas: 6000, despesas: 3100, saldo: 2900 },
    { month: 'Mai', receitas: 5700, despesas: 3500, saldo: 2200 },
    { month: 'Jun', receitas: 5900, despesas: 3300, saldo: 2600 }
  ])

  const [categoryData] = useState([
    { category: 'Alimentação', value: 1200, color: '#3B82F6' },
    { category: 'Transporte', value: 800, color: '#10B981' },
    { category: 'Moradia', value: 1500, color: '#F59E0B' },
    { category: 'Lazer', value: 600, color: '#8B5CF6' },
    { category: 'Saúde', value: 400, color: '#EF4444' },
    { category: 'Outros', value: 300, color: '#6B7280' }
  ])

  const [expenseEvolutionData] = useState([
    { month: 'Jan', alimentacao: 1100, transporte: 750, moradia: 1500, lazer: 500 },
    { month: 'Fev', alimentacao: 1250, transporte: 800, moradia: 1500, lazer: 600 },
    { month: 'Mar', alimentacao: 1300, transporte: 850, moradia: 1500, lazer: 700 },
    { month: 'Abr', alimentacao: 1150, transporte: 780, moradia: 1500, lazer: 550 },
    { month: 'Mai', alimentacao: 1200, transporte: 820, moradia: 1500, lazer: 650 },
    { month: 'Jun', alimentacao: 1200, transporte: 800, moradia: 1500, lazer: 600 }
  ])

  const [goalsData] = useState([
    { name: 'Casa Própria', target: 150000, current: 45000, progress: 30 },
    { name: 'Viagem Europa', target: 15000, current: 8500, progress: 56.7 },
    { name: 'Fundo Emergência', target: 20000, current: 12000, progress: 60 }
  ])

  const [summaryData] = useState({
    totalIncome: 35100,
    totalExpenses: 20300,
    netSavings: 14800,
    savingsRate: 42.2,
    topExpenseCategory: 'Moradia',
    topExpenseAmount: 9000,
    goalsOnTrack: 2,
    totalGoals: 3
  })

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleGeneratePDF = async () => {
    setIsGenerating(true)
    try {
      await generateReportPDF({
        summaryData,
        monthlyData,
        categoryData,
        goalsData,
        selectedPeriod
      })
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Por favor, tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const reportTypes = [
    { id: 'overview', name: 'Visão Geral', icon: BarChart3 },
    { id: 'income-expenses', name: 'Receitas vs Despesas', icon: TrendingUp },
    { id: 'categories', name: 'Por Categoria', icon: PieChart },
    { id: 'goals', name: 'Metas Financeiras', icon: Target },
    { id: 'trends', name: 'Tendências', icon: LineChart }
  ]

  const periods = [
    { value: 'current-month', label: 'Mês Atual' },
    { value: 'last-month', label: 'Mês Passado' },
    { value: 'last-3-months', label: 'Últimos 3 Meses' },
    { value: 'last-6-months', label: 'Últimos 6 Meses' },
    { value: 'current-year', label: 'Ano Atual' },
    { value: 'custom', label: 'Período Personalizado' }
  ]

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
          <h2 className={styles.title}>Relatórios Financeiros</h2>
          <p className={styles.subtitle}>Análises detalhadas da sua vida financeira</p>
        </div>
        
        <div className={styles.controls}>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className={styles.periodSelect}>
              <Calendar className={styles.tabIcon} />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <button 
            className={styles.pdfButton}
            onClick={handleGeneratePDF}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className={styles.tabIcon} />
            ) : (
              <Download className={styles.tabIcon} />
            )}
            {isGenerating ? 'Gerando...' : 'Gerar PDF'}
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
        <div className={`${styles.summaryCard} ${styles.cardGreen}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Receitas Totais</h3>
            <TrendingUp className={styles.cardIcon} />
          </div>
          <div className={styles.cardValue}>{formatCurrency(summaryData.totalIncome)}</div>
          <p className={styles.cardDescription}>no período selecionado</p>
        </div>

        <div className={`${styles.summaryCard} ${styles.cardRed}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Despesas Totais</h3>
            <TrendingDown className={styles.cardIcon} />
          </div>
          <div className={styles.cardValue}>{formatCurrency(summaryData.totalExpenses)}</div>
          <p className={styles.cardDescription}>no período selecionado</p>
        </div>

        <div className={`${styles.summaryCard} ${styles.cardBlue}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Economia Líquida</h3>
            <Wallet className={styles.cardIcon} />
          </div>
          <div className={styles.cardValue}>{formatCurrency(summaryData.netSavings)}</div>
          <p className={styles.cardDescription}>{summaryData.savingsRate.toFixed(1)}% da renda</p>
        </div>

        <div className={`${styles.summaryCard} ${styles.cardPurple}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Metas no Prazo</h3>
            <Target className={styles.cardIcon} />
          </div>
          <div className={styles.cardValue}>
            {summaryData.goalsOnTrack}/{summaryData.totalGoals}
          </div>
          <p className={styles.cardDescription}>metas em andamento</p>
        </div>
      </motion.div>

      {/* Report Tabs */}
      <motion.div
        className={styles.tabsContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs value={selectedReport} onValueChange={setSelectedReport} className="w-full">
          <div className={styles.tabsList}>
            {reportTypes.map((report) => (
              <button
                key={report.id}
                className={`${styles.tabTrigger} ${
                  selectedReport === report.id ? styles.tabTriggerActive : ''
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <report.icon className={styles.tabIcon} />
                <span>{report.name}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Fluxo de Caixa Mensal</h3>
                <p className={styles.chartDescription}>Receitas, despesas e saldo ao longo do tempo</p>
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                      <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                      <Line type="monotone" dataKey="saldo" stroke="#3B82F6" strokeWidth={3} name="Saldo" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Distribuição de Gastos</h3>
                <p className={styles.chartDescription}>Principais categorias de despesas</p>
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.category}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Evolução por Categoria</h3>
                <p className={styles.chartDescription}>Como seus gastos mudaram ao longo do tempo</p>
                <div className={styles.chartContainer}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={expenseEvolutionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Area type="monotone" dataKey="moradia" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Moradia" />
                      <Area type="monotone" dataKey="alimentacao" stackId="1" stroke="#F59E0B" fill="#F59E0B" name="Alimentação" />
                      <Area type="monotone" dataKey="transporte" stackId="1" stroke="#10B981" fill="#10B981" name="Transporte" />
                      <Area type="monotone" dataKey="lazer" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" name="Lazer" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className={styles.chartCard}>
                <h3 className={styles.chartTitle}>Ranking de Categorias</h3>
                <p className={styles.chartDescription}>Maiores gastos por categoria</p>
                <div className={styles.categoriesList}>
                  {categoryData
                    .sort((a, b) => b.value - a.value)
                    .map((category, index) => {
                      const total = categoryData.reduce((sum, cat) => sum + cat.value, 0)
                      const percentage = ((category.value / total) * 100).toFixed(1)
                      return (
                        <div key={index} className={styles.categoryItem}>
                          <div className={styles.categoryRank}>
                            <div className={styles.rankNumber}>#{index + 1}</div>
                            <div className={styles.categoryInfo}>
                              <h4>{category.category}</h4>
                              <p>{percentage}% do total</p>
                            </div>
                          </div>
                          <div className={styles.categoryAmount}>{formatCurrency(category.value)}</div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Acompanhamento de Metas</h3>
              <p className={styles.chartDescription}>Seu progresso em direção aos seus objetivos financeiros</p>
              <div className={styles.goalsContainer}>
                {goalsData.map((goal, index) => (
                  <div key={index} className={styles.goalItem}>
                    <div className={styles.goalHeader}>
                      <span className={styles.goalName}>{goal.name}</span>
                      <span className={styles.goalPercentage}>{goal.progress.toFixed(1)}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <div className={styles.goalNumbers}>
                      <span>{formatCurrency(goal.current)}</span>
                      <span>{formatCurrency(goal.target)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Income vs Expenses Tab */}
          <TabsContent value="income-expenses" className="space-y-6">
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Comparativo Mensal: Receitas vs Despesas</h3>
              <p className={styles.chartDescription}>Análise detalhada do fluxo financeiro</p>
              <div className={styles.chartContainer} style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Bar dataKey="receitas" fill="#10B981" name="Receitas" />
                    <Bar dataKey="despesas" fill="#EF4444" name="Despesas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Tendências de Saldo</h3>
              <p className={styles.chartDescription}>Evolução do seu saldo mensal</p>
              <div className={styles.chartContainer} style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="saldo" stroke="#3B82F6" strokeWidth={3} name="Saldo" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}

export default Reports

