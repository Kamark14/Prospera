# Recomendações para Implementação do Backend do Projeto Prospera

Este documento apresenta recomendações para a implementação do backend do projeto Prospera, utilizando **Node.js** com **Express.js** e **MySQL** como banco de dados, conforme solicitado. O foco será em uma arquitetura robusta, segura e escalável para suportar as funcionalidades do frontend.

## 1. Arquitetura Sugerida

Uma arquitetura em camadas é recomendada para separar as preocupações e facilitar a manutenção e o desenvolvimento. Sugere-se a seguinte estrutura:

-   **Camada de Roteamento (Routes):** Define os endpoints da API e direciona as requisições para os controladores apropriados.
-   **Camada de Controle (Controllers):** Contém a lógica de negócio principal, processa as requisições, interage com a camada de serviço e envia as respostas.
-   **Camada de Serviço (Services):** Encapsula a lógica de negócio específica e orquestra as operações, interagindo com a camada de repositório.
-   **Camada de Repositório (Repositories/DAOs):** Abstrai a interação com o banco de dados, contendo a lógica para operações CRUD (Create, Read, Update, Delete).
-   **Camada de Modelos (Models):** Define a estrutura dos dados e as validações, geralmente utilizando um ORM (Object-Relational Mapper).

```
backend/
├── src/
│   ├── config/             # Configurações do ambiente, banco de dados, etc.
│   ├── controllers/        # Lógica de negócio e manipulação de requisições
│   ├── models/             # Definição dos modelos de dados (ex: Usuário, Meta, Transação)
│   ├── routes/             # Definição das rotas da API
│   ├── services/           # Lógica de negócio específica e orquestração
│   ├── repositories/       # Interação com o banco de dados
│   ├── middleware/         # Middlewares de autenticação, validação, tratamento de erros
│   └── app.js              # Configuração principal do Express
├── .env                    # Variáveis de ambiente
├── package.json
├── package-lock.json
└── server.js               # Ponto de entrada da aplicação (inicia o servidor)
```

## 2. Tecnologias e Ferramentas

-   **Linguagem:** JavaScript
-   **Runtime:** Node.js
-   **Framework Web:** Express.js
-   **Banco de Dados:** MySQL
-   **ORM (Object-Relational Mapper):** Sequelize ou TypeORM (recomendado para abstrair a interação com o MySQL e facilitar o desenvolvimento).
-   **Autenticação:** JWT (JSON Web Tokens) para autenticação baseada em token.
-   **Validação:** Joi ou Express-validator para validação de dados de entrada.
-   **Variáveis de Ambiente:** `dotenv` para gerenciar variáveis de ambiente.
-   **Testes:** Jest ou Mocha/Chai para testes unitários e de integração.

## 3. Funcionalidades Essenciais do Backend

O backend precisará suportar as seguintes funcionalidades, refletindo as necessidades do frontend:

### 3.1. Autenticação e Autorização

-   **Registro de Usuário:** Endpoint para criar novas contas de usuário.
    -   `POST /api/auth/register`
-   **Login de Usuário:** Endpoint para autenticar usuários e gerar JWT.
    -   `POST /api/auth/login`
-   **Proteção de Rotas:** Middleware para proteger rotas que exigem autenticação.
-   **Gerenciamento de Sessão:** Utilização de JWT para manter o estado de autenticação.

### 3.2. Gerenciamento de Usuários

-   **Obter Perfil do Usuário:** Endpoint para buscar informações do usuário logado.
    -   `GET /api/users/me`
-   **Atualizar Perfil do Usuário:** Endpoint para permitir que o usuário edite suas informações pessoais.
    -   `PUT /api/users/me`

### 3.3. Gerenciamento de Finanças (Transações)

-   **Adicionar Transação:** Endpoint para registrar receitas e despesas.
    -   `POST /api/transactions`
-   **Listar Transações:** Endpoint para buscar todas as transações de um usuário, com filtros por tipo, categoria, data.
    -   `GET /api/transactions`
-   **Atualizar Transação:** Endpoint para editar uma transação existente.
    -   `PUT /api/transactions/:id`
-   **Excluir Transação:** Endpoint para remover uma transação.
    -   `DELETE /api/transactions/:id`
-   **Resumo Financeiro:** Endpoints para calcular renda total, despesas totais e saldo disponível.
    -   `GET /api/finances/summary`

### 3.4. Gerenciamento de Metas

-   **Adicionar Meta:** Endpoint para criar uma nova meta financeira.
    -   `POST /api/goals`
-   **Listar Metas:** Endpoint para buscar todas as metas de um usuário.
    -   `GET /api/goals`
-   **Atualizar Meta:** Endpoint para atualizar o progresso ou detalhes de uma meta.
    -   `PUT /api/goals/:id`
-   **Excluir Meta:** Endpoint para remover uma meta.
    -   `DELETE /api/goals/:id`

### 3.5. Gerenciamento de Contas a Pagar

-   **Adicionar Conta:** Endpoint para registrar uma nova conta a pagar.
    -   `POST /api/bills`
-   **Listar Contas:** Endpoint para buscar todas as contas a pagar de um usuário, com filtros por status (paga/pendente) e data de vencimento.
    -   `GET /api/bills`
-   **Atualizar Conta:** Endpoint para marcar uma conta como paga ou editar seus detalhes.
    -   `PUT /api/bills/:id`
-   **Excluir Conta:** Endpoint para remover uma conta.
    -   `DELETE /api/bills/:id`

### 3.6. Relatórios e Patrimônio

-   **Relatórios Financeiros:** Endpoints para gerar dados para gráficos e resumos (ex: fluxo de caixa mensal, distribuição de gastos).
    -   `GET /api/reports/cashflow`
    -   `GET /api/reports/expenses-by-category`
-   **Patrimônio:** Endpoints para calcular e exibir o patrimônio líquido, total de ativos e passivos.
    -   `GET /api/patrimony/summary`
    -   `GET /api/patrimony/evolution`

## 4. Considerações de Segurança

-   **Validação de Entrada:** Validar todos os dados de entrada para prevenir ataques como injeção SQL e XSS.
-   **Hashing de Senhas:** Armazenar senhas utilizando algoritmos de hash seguros (ex: bcrypt).
-   **JWT:** Utilizar JWTs com chaves secretas fortes e tempos de expiração adequados. Implementar refresh tokens para melhorar a segurança.
-   **HTTPS:** Garantir que todas as comunicações com a API sejam feitas via HTTPS.
-   **CORS:** Configurar corretamente o CORS (Cross-Origin Resource Sharing) para permitir requisições apenas de origens autorizadas (o frontend).
-   **Rate Limiting:** Implementar limites de taxa para prevenir ataques de força bruta e DDoS.
-   **Variáveis de Ambiente:** Não armazenar informações sensíveis diretamente no código. Utilizar variáveis de ambiente (`.env`).

## 5. Configuração do Banco de Dados (MySQL)

-   **Criação do Banco de Dados:**
    ```sql
    CREATE DATABASE prospera_db;
    USE prospera_db;
    ```
-   **Tabelas Essenciais (Exemplos):**

    ```sql
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type ENUM("income", "expense") NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255),
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE goals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        target_amount DECIMAL(10, 2) NOT NULL,
        current_amount DECIMAL(10, 2) DEFAULT 0.00,
        type VARCHAR(255),
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE bills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        due_date DATE NOT NULL,
        category VARCHAR(255),
        is_paid BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    ```

## 6. Próximos Passos para o Desenvolvimento do Backend

1.  **Configuração do Projeto Node.js:** Inicializar um novo projeto Node.js (`npm init`) e instalar as dependências (`express`, `mysql2`, `sequelize` ou `typeorm`, `dotenv`, `bcryptjs`, `jsonwebtoken`, `joi` ou `express-validator`, `cors`).
2.  **Conexão com o Banco de Dados:** Configurar a conexão com o MySQL usando o ORM escolhido.
3.  **Definição dos Modelos:** Criar os modelos para `User`, `Transaction`, `Goal`, `Bill` e outros que forem necessários.
4.  **Implementação dos Repositórios:** Criar a lógica de interação com o banco de dados para cada modelo.
5.  **Implementação dos Serviços:** Desenvolver a lógica de negócio para cada funcionalidade.
6.  **Definição dos Controladores:** Criar os controladores para processar as requisições e chamar os serviços.
7.  **Definição das Rotas:** Configurar as rotas da API com Express.js.
8.  **Middlewares:** Implementar middlewares para autenticação, autorização e tratamento de erros.
9.  **Testes:** Escrever testes unitários e de integração para garantir a funcionalidade e a robustez do backend.
10. **Documentação da API:** Utilizar ferramentas como Swagger/OpenAPI para documentar a API, facilitando a integração com o frontend.

Ao seguir estas diretrizes, o backend do projeto Prospera será construído de forma sólida e eficiente, complementando as melhorias realizadas no frontend.

**Autor:** Manus AI
**Data:** 30 de Setembro de 2025

