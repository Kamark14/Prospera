# Prospera - App de Gestão Financeira Pessoal

## Visão Geral

O **Prospera** é um aplicativo de gestão financeira pessoal desenvolvido em React Native com Expo, projetado para ajudar usuários a controlar suas finanças, definir metas, acompanhar patrimônio e gerar relatórios detalhados.

## Funcionalidades Implementadas

### 🏠 Dashboard Principal
- **Saldo do mês** com indicador visual
- **Resumo de receitas e despesas** do período atual
- **Cards de navegação rápida** para todas as funcionalidades
- **Botões de ação rápida** para adicionar receitas e despesas
- **Interface personalizada** com saudação ao usuário

### 👤 Perfil do Usuário Completo
- **Informações pessoais**: Nome, email, foto, data de nascimento, telefone
- **Informações financeiras**: Renda mensal líquida, renda extra, nível de risco
- **Contexto de vida**: Profissão, estado civil, dependentes, localização
- **Preferências do app**: Moeda, notificações, privacidade
- **Personalização** baseada no perfil para sugestões e alertas

### 🎯 Metas Financeiras Avançadas
- **Categorias específicas**: Casa, Viagem, Casamento, Educação, Emergência, Aposentadoria
- **Campos dinâmicos** por categoria (ex: Casa tem tipo de imóvel, entrada, custos extras)
- **Cálculos automáticos**: Valor de entrada, contribuição mensal sugerida
- **Checklist de custos extras** (ITBI, registro, corretagem, reforma)
- **Barra de progresso visual** e acompanhamento detalhado
- **Opção de meta personalizada** para flexibilidade

### 💰 Patrimônio Acumulado (Nova Funcionalidade)
- **Dashboard completo** com patrimônio líquido total e variação
- **Gráfico de composição** (ativos líquidos, investimentos, bens, passivos)
- **Listagem detalhada** de ativos e passivos com categorização
- **KPIs principais**: Total de ativos, passivos e patrimônio líquido
- **Adição manual** de ativos e passivos com campos específicos
- **Insights automatizados** baseados na análise dos dados

### 💸 Gastos e Receitas Melhorados
- **Categorização avançada** com ícones e cores
- **Gráfico de gastos por categoria** (pizza/donut)
- **Resumo financeiro** com saldo do período
- **Listagem organizada** de transações recentes
- **Filtros e busca** por categoria e período
- **Interface intuitiva** para adição rápida

### 📋 Contas a Pagar Inteligente
- **Gestão de recorrência** (única, mensal, bimestral, etc.)
- **Status automático** (pendente, paga, atrasada)
- **Filtros avançados**: Próximas, este mês, atrasadas, todas
- **KPIs importantes**: Total a pagar, próximos 7 dias, contas atrasadas
- **Alertas visuais** para contas em atraso
- **Categorização** com ícones e cores específicas
- **Método de pagamento** e observações

### 📊 Relatórios Avançados
- **Filtros por período**: Este mês, mês passado, últimos 3/6 meses, ano
- **Resumo executivo** com KPIs principais
- **Gráficos múltiplos**: Receita vs Despesa, gastos por categoria
- **Insights automatizados** baseados nos dados
- **Lista de transações** do período selecionado
- **Preparação para exportação** (PDF/CSV)

## Tecnologias Utilizadas

- **React Native** com Expo SDK 54
- **React Navigation** para navegação entre telas
- **AsyncStorage** para persistência local de dados
- **React Native Chart Kit** para gráficos e visualizações
- **Expo Vector Icons** (Ionicons) para ícones
- **React Native Picker** para seletores
- **Expo Image Picker** (preparado para fotos de perfil)

## Estrutura do Projeto

```
ProsperoApp/
├── App.js                      # Componente principal com navegação
├── screens/                    # Telas do aplicativo
│   ├── TelaLogin.js           # Tela de login
│   ├── TelaCadastro.js        # Tela de cadastro
│   ├── TelaDashboard.js       # Dashboard principal
│   ├── TelaUsuario.js         # Perfil básico do usuário
│   ├── TelaConfigPerfil.js    # Configuração completa do perfil
│   ├── TelaMetas.js           # Metas financeiras avançadas
│   ├── TelaPatrimonio.js      # Patrimônio acumulado (nova)
│   ├── TelaGastos.js          # Gastos e receitas
│   ├── TelaContas.js          # Contas a pagar
│   └── TelaRelatorios.js      # Relatórios avançados
├── package.json               # Dependências do projeto
└── README.md                  # Esta documentação
```

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)

### Instalação

1. **Clone ou baixe o projeto**
```bash
cd ProsperoApp
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto**

Para desenvolvimento web:
```bash
npm run web
```

Para dispositivos móveis:
```bash
npx expo start
```

### Testando o Aplicativo

1. **Acesse a tela inicial** e clique em "INICIAR"
2. **Cadastre um novo usuário** ou use dados de teste:
   - Nome: João Silva
   - CPF: 123.456.789-00
   - Email: joao@teste.com
   - Senha: 123456

3. **Explore as funcionalidades**:
   - Configure seu perfil completo
   - Defina metas financeiras com categorias específicas
   - Adicione ativos e passivos no patrimônio
   - Registre gastos e receitas
   - Configure contas a pagar
   - Gere relatórios com filtros

## Principais Melhorias Implementadas

### 1. **Perfil do Usuário Expandido**
- Campos adicionais para personalização
- Informações financeiras para cálculos automáticos
- Contexto de vida para sugestões inteligentes

### 2. **Metas Financeiras Inteligentes**
- Categorias específicas com campos dinâmicos
- Cálculos automáticos de contribuição
- Checklist de custos extras

### 3. **Patrimônio Acumulado (Novo)**
- Dashboard completo de patrimônio
- Gráficos de composição
- Gestão de ativos e passivos

### 4. **Relatórios Avançados**
- Filtros por múltiplos períodos
- Insights automatizados
- Visualizações gráficas múltiplas

### 5. **Contas a Pagar Inteligente**
- Gestão de recorrência
- Alertas de vencimento
- Status automático

### 6. **Interface Melhorada**
- Design consistente e moderno
- Navegação intuitiva
- Feedback visual aprimorado

## Dados Armazenados

O aplicativo utiliza AsyncStorage para persistir dados localmente:

- `@perfil`: Informações completas do usuário
- `@metas`: Metas financeiras com categorias
- `@ativos`: Lista de ativos do patrimônio
- `@passivos`: Lista de passivos do patrimônio
- `@gastos`: Transações de gastos
- `@receitas`: Transações de receitas
- `@contas`: Contas a pagar com recorrência

## Próximos Passos Sugeridos

1. **Integração com APIs** para cotações e dados bancários
2. **Notificações push** para lembretes de contas
3. **Backup na nuvem** para sincronização entre dispositivos
4. **Exportação real** de relatórios em PDF/CSV
5. **Leitor de boletos** via câmera
6. **Gráficos de evolução temporal** do patrimônio
7. **Metas compartilhadas** entre usuários
8. **Integração com Open Banking**

## Suporte

Para dúvidas ou sugestões sobre o projeto, consulte a documentação do React Native e Expo:
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)

---

**Desenvolvido com ❤️ para ajudar você a prosperar financeiramente!**

