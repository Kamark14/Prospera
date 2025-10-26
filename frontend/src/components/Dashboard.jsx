// Dashboard.jsx
import React, { useState } from 'react';
import { TrendingUp, Wallet, Target, PieChart, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import styles from '../styles/Dashboard.module.css';

const Dashboard = ({ openNewGoalModal, openNewBillModal }) => {
  // Estado para metas
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: 'Casa Própria',
      category: 'Imóvel',
      currentAmount: 45000,
      targetAmount: 150000,
      deadline: '2025-12-30',
      percentage: '30.0'
    },
    {
      id: 2,
      name: 'Viagem Europa',
      category: 'Viagem',
      currentAmount: 8500,
      targetAmount: 15000,
      deadline: '2024-07-14',
      percentage: '56.7'
    },
    {
      id: 3,
      name: 'Fundo de Emergência',
      category: 'Emergência',
      currentAmount: 12000,
      targetAmount: 20000,
      deadline: '2024-12-30',
      percentage: '60.0'
    }
  ]);

  // Estado para contas
  const [bills, setBills] = useState([
    {
      id: 1,
      name: 'Aluguel',
      amount: 1200,
      dueDate: '2024-01-04',
      category: 'Moradia',
      status: 'Pendente'
    },
    {
      id: 2,
      name: 'Energia Elétrica',
      amount: 180,
      dueDate: '2024-01-07',
      category: 'Serviços',
      status: 'Pendente'
    },
    {
      id: 3,
      name: 'Internet',
      amount: 89.90,
      dueDate: '2024-01-09',
      category: 'Serviços',
      status: 'Pendente'
    },
    {
      id: 4,
      name: 'Cartão de Crédito',
      amount: 850,
      dueDate: '2024-01-14',
      category: 'Outros',
      status: 'Pendente'
    }
  ]);

  // Componente GoalItem integrado
  const GoalItem = ({ goal, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      name: goal.name,
      category: goal.category,
      currentAmount: goal.currentAmount,
      targetAmount: goal.targetAmount,
      deadline: goal.deadline
    });

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleCancel = () => {
      setIsEditing(false);
      setEditData({
        name: goal.name,
        category: goal.category,
        currentAmount: goal.currentAmount,
        targetAmount: goal.targetAmount,
        deadline: goal.deadline
      });
    };

    const handleSave = () => {
      const current = parseFloat(editData.currentAmount) || 0;
      const target = parseFloat(editData.targetAmount);
      const percentage = (current / target) * 100;

      onUpdate(goal.id, {
        ...editData,
        currentAmount: current,
        targetAmount: target,
        percentage: percentage.toFixed(1)
      });
      setIsEditing(false);
    };

    const handleDelete = () => {
      if (window.confirm(`Tem certeza que deseja excluir a meta "${goal.name}"?`)) {
        onDelete(goal.id);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    if (isEditing) {
      return (
        <div className={styles.editingItem}>
          <div className={styles.editForm}>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.label}>Nome</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>Categoria</label>
                <input
                  type="text"
                  name="category"
                  value={editData.category}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.label}>Valor Atual (R$)</label>
                <input
                  type="number"
                  name="currentAmount"
                  value={editData.currentAmount}
                  onChange={handleChange}
                  step="0.01"
                  className={styles.input}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>Valor Objetivo (R$)</label>
                <input
                  type="number"
                  name="targetAmount"
                  value={editData.targetAmount}
                  onChange={handleChange}
                  step="0.01"
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Prazo</label>
              <input
                type="date"
                name="deadline"
                value={editData.deadline}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formActions}>
              <button
                onClick={handleSave}
                className={styles.saveButton}
              >
                <Save className={styles.buttonIcon} />
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                <X className={styles.buttonIcon} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.goalItem}>
        <div className={styles.goalContent}>
          <div className={styles.goalHeader}>
            <h3 className={styles.goalTitle}>{goal.name}</h3>
            <div className={styles.goalActions}>
              <div className={styles.goalInfo}>
                <span className={styles.goalCategory}>{goal.category}</span>
                <div className={styles.goalPercentage}>{goal.percentage}%</div>
              </div>
              <div className={styles.actionButtons}>
                <button
                  onClick={handleEdit}
                  className={styles.editButton}
                  title="Editar meta"
                >
                  <Edit2 className={styles.actionIcon} />
                </button>
                <button
                  onClick={handleDelete}
                  className={styles.deleteButton}
                  title="Excluir meta"
                >
                  <Trash2 className={styles.actionIcon} />
                </button>
              </div>
            </div>
          </div>
          <p className={styles.goalAmount}>
            R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${Math.min(goal.percentage, 100)}%` }}
            ></div>
          </div>
          <p className={styles.goalDeadline}>
            Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>
    );
  };

  // Componente BillItem integrado
  const BillItem = ({ bill, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
      name: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      category: bill.category,
      status: bill.status || 'Pendente'
    });

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleCancel = () => {
      setIsEditing(false);
      setEditData({
        name: bill.name,
        amount: bill.amount,
        dueDate: bill.dueDate,
        category: bill.category,
        status: bill.status || 'Pendente'
      });
    };

    const handleSave = () => {
      onUpdate(bill.id, {
        ...editData,
        amount: parseFloat(editData.amount)
      });
      setIsEditing(false);
    };

    const handleDelete = () => {
      if (window.confirm(`Tem certeza que deseja excluir a conta "${bill.name}"?`)) {
        onDelete(bill.id);
      }
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const formatDueDate = (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      const diffTime = date - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return `Venceu há ${Math.abs(diffDays)} dias`;
      } else if (diffDays === 0) {
        return 'Vence hoje';
      } else if (diffDays === 1) {
        return 'Vence amanhã';
      } else {
        return `Vence em ${diffDays} dias`;
      }
    };

    const getStatusColor = () => {
      const date = new Date(bill.dueDate);
      const today = new Date();
      const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

      if (bill.status === 'Pago') return styles.statusPaid;
      if (diffDays < 0 || bill.status === 'Atrasado') return styles.statusOverdue;
      if (diffDays <= 3) return styles.statusWarning;
      return styles.statusPending;
    };

    if (isEditing) {
      return (
        <div className={styles.editingItem}>
          <div className={styles.editForm}>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.label}>Nome</label>
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>Categoria</label>
                <select
                  name="category"
                  value={editData.category}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="Moradia">Moradia</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Educação">Educação</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Serviços">Serviços</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.label}>Valor (R$)</label>
                <input
                  type="number"
                  name="amount"
                  value={editData.amount}
                  onChange={handleChange}
                  step="0.01"
                  className={styles.input}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>Vencimento</label>
                <input
                  type="date"
                  name="dueDate"
                  value={editData.dueDate}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>

            <div className={styles.formField}>
              <label className={styles.label}>Status</label>
              <select
                name="status"
                value={editData.status}
                onChange={handleChange}
                className={styles.input}
              >
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Atrasado">Atrasado</option>
              </select>
            </div>

            <div className={styles.formActions}>
              <button
                onClick={handleSave}
                className={styles.saveButton}
              >
                <Save className={styles.buttonIcon} />
                Salvar
              </button>
              <button
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                <X className={styles.buttonIcon} />
                Cancelar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.billItem}>
        <div className={styles.billContent}>
          <div className={styles.billInfo}>
            <div className={styles.billDetails}>
              <p className={styles.billName}>{bill.name}</p>
              <p className={styles.billAmount}>
                R$ {bill.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
              {bill.category && (
                <p className={styles.billCategory}>{bill.category}</p>
              )}
            </div>
            <div className={styles.billStatus}>
              <div className={styles.statusInfo}>
                <p className={`${styles.dueDate} ${getStatusColor()}`}>
                  {formatDueDate(bill.dueDate)}
                </p>
                <p className={styles.date}>
                  {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                </p>
                {bill.status && (
                  <p className={styles.status}>
                    {bill.status}
                  </p>
                )}
              </div>
              <div className={styles.actionButtons}>
                <button
                  onClick={handleEdit}
                  className={styles.editButton}
                  title="Editar conta"
                >
                  <Edit2 className={styles.actionIcon} />
                </button>
                <button
                  onClick={handleDelete}
                  className={styles.deleteButton}
                  title="Excluir conta"
                >
                  <Trash2 className={styles.actionIcon} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Funções para gerenciar metas
  const handleAddGoal = (newGoal) => {
    setGoals(prev => [...prev, newGoal]);
  };

  const handleUpdateGoal = (id, updatedData) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updatedData } : goal
    ));
  };

  const handleDeleteGoal = (id) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  // Funções para gerenciar contas
  const handleAddBill = (newBill) => {
    setBills(prev => [...prev, newBill]);
  };

  const handleUpdateBill = (id, updatedData) => {
    setBills(prev => prev.map(bill => 
      bill.id === id ? { ...bill, ...updatedData } : bill
    ));
  };

  const handleDeleteBill = (id) => {
    setBills(prev => prev.filter(bill => bill.id !== id));
  };

  // Expor funções para o componente pai
  React.useEffect(() => {
    window.dashboardHandlers = {
      addGoal: handleAddGoal,
      addBill: handleAddBill
    };
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* Cards de Resumo */}
      <div className={styles.summaryCards}>
        <div className={`${styles.card} ${styles.incomeCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Renda Total</div>
            <TrendingUp className={styles.cardIcon} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>R$ 0.000,00</div>
            <p className={styles.cardInfo}>este mês</p>
          </div>
        </div>
        
        <div className={`${styles.card} ${styles.expenseCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Despesas Totais</div>
            <Wallet className={styles.cardIcon} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>R$ 0.000,00</div>
            <p className={styles.cardInfo}>este mês</p>
          </div>
        </div>
        
        <div className={`${styles.card} ${styles.balanceCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>Saldo Disponível</div>
            <PieChart className={styles.cardIcon} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardValue}>R$ 0.000,00</div>
            <p className={styles.cardInfo}>este mês</p>
          </div>
        </div>
      </div>

      {/* Metas em Andamento */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <h3 className={styles.title}>Metas em Andamento</h3>
            <p className={styles.description}>Acompanhe o progresso das suas metas financeiras</p>
          </div>
          <button 
            onClick={openNewGoalModal} 
            className={styles.addButton}
          >
            <Plus className={styles.buttonIcon} />
            <span>Nova Meta</span>
          </button>
        </div>
        <div className={styles.sectionContent}>
          {goals.length === 0 ? (
            <p className={styles.emptyState}>
              Nenhuma meta cadastrada. Clique em "Nova Meta" para começar!
            </p>
          ) : (
            goals.map(goal => (
              <GoalItem
                key={goal.id}
                goal={goal}
                onUpdate={handleUpdateGoal}
                onDelete={handleDeleteGoal}
              />
            ))
          )}
        </div>
      </div>

      {/* Próximas Contas a Pagar */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitle}>
            <h3 className={styles.title}>Próximas Contas a Pagar</h3>
            <p className={styles.description}>Contas com vencimento próximo</p>
          </div>
          <button 
            onClick={openNewBillModal} 
            className={styles.addButton}
          >
            <Plus className={styles.buttonIcon} />
            <span>Nova Conta</span>
          </button>
        </div>
        <div className={styles.sectionContent}>
          {bills.length === 0 ? (
            <p className={styles.emptyState}>
              Nenhuma conta cadastrada. Clique em "Nova Conta" para adicionar!
            </p>
          ) : (
            bills
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map(bill => (
                <BillItem
                  key={bill.id}
                  bill={bill}
                  onUpdate={handleUpdateBill}
                  onDelete={handleDeleteBill}
                />
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;