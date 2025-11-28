CREATE DATABASE IF NOT EXISTS `prospera_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `prospera_db`;

-- ===== tabela principal de usuários (formato compatível com controllers: Usuario_*)
CREATE TABLE IF NOT EXISTS `usuario` (
  `Usuario_Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Usuario_Nome` VARCHAR(150) NOT NULL,
  `Usuario_CPF` VARCHAR(50) DEFAULT NULL,
  `Usuario_Email` VARCHAR(150) NOT NULL,
  `Usuario_Senha` VARCHAR(255) NOT NULL,
  `Usuario_Imagem` VARCHAR(255) DEFAULT NULL,
  `Usuario_Foto` VARCHAR(255) DEFAULT NULL,
  `Usuario_Risco` VARCHAR(50) DEFAULT 'moderado',
  `Usuario_Nome_Exibicao` VARCHAR(150) DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `ux_usuario_email` (`Usuario_Email`),
  UNIQUE KEY `ux_usuario_cpf` (`Usuario_CPF`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- REMOVIDA: A instrução ALTER TABLE que adicionava a coluna gerada 'id'
-- A compatibilidade com o campo 'id' no frontend será tratada exclusivamente pelo backend.

-- ===== tabela de informações detalhadas do usuário (ATUALIZADA)
CREATE TABLE IF NOT EXISTS `usuario_info` (
  `Usuario_Info_Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Usuario_Id` INT NOT NULL,
  `Usuario_Endereco` VARCHAR(255) DEFAULT NULL,
  `Usuario_Cidade` VARCHAR(100) DEFAULT NULL,
  `Usuario_Estado` VARCHAR(100) DEFAULT NULL,
  `Usuario_CEP` VARCHAR(30) DEFAULT NULL,
  `Usuario_Pais` VARCHAR(100) DEFAULT 'Brasil',
  `Usuario_Telefone` VARCHAR(30) DEFAULT NULL,
  `Usuario_Profissao` VARCHAR(150) DEFAULT NULL,
  `Usuario_Emprego_Atual` VARCHAR(150) DEFAULT NULL,
  `Usuario_Dia_De_Pagamento` DATE DEFAULT NULL,
  `Usuario_Salario` DECIMAL(14,2) DEFAULT 0,
  `Usuario_Data_Nascimento` DATE DEFAULT NULL,
  `Usuario_Renda_Mensal_Fixa` DECIMAL(14,2) DEFAULT 0,
  `Usuario_Renda_Extra` DECIMAL(14,2) DEFAULT 0,
  -- NOVOS CAMPOS ADICIONADOS
  `Usuario_Estado_Civil` VARCHAR(50) DEFAULT 'solteiro',
  `Usuario_Dependentes` INT DEFAULT 0,
  `Usuario_Objetivo_Principal` VARCHAR(100) DEFAULT 'imovel',
  `Usuario_Moeda_Preferida` VARCHAR(8) DEFAULT 'BRL',
  `Usuario_Notificacoes_Gastos` BOOLEAN DEFAULT TRUE,
  `Usuario_Notificacoes_Metas` BOOLEAN DEFAULT TRUE,
  `Usuario_Notificacoes_Contas` BOOLEAN DEFAULT TRUE,
  `Usuario_Notificacoes_Relatorios` BOOLEAN DEFAULT FALSE,
  `Usuario_Privacidade_Dados` BOOLEAN DEFAULT FALSE,
  `Usuario_Privacidade_Analytics` BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (`Usuario_Id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== perfil de administradores (opcional)
CREATE TABLE IF NOT EXISTS `admin_perfil` (
  `Admin_Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Admin_Nome` VARCHAR(150) NOT NULL,
  `Admin_Email` VARCHAR(150) NOT NULL UNIQUE,
  `Admin_Senha` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== contas (app finances)
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `balance` DECIMAL(14,2) DEFAULT 0,
  `currency` VARCHAR(8) DEFAULT 'BRL',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `account_id` INT DEFAULT NULL,
  `type` ENUM('expense','income','transfer') NOT NULL,
  `category` VARCHAR(120) DEFAULT NULL,
  `amount` DECIMAL(14,2) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `date` DATE DEFAULT (CURRENT_DATE),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE,
  FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== goals
CREATE TABLE IF NOT EXISTS `goals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `target_amount` DECIMAL(14,2) NOT NULL,
  `current_amount` DECIMAL(14,2) DEFAULT 0,
  `due_date` DATE DEFAULT NULL,
  `status` ENUM('active','paused','completed') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== patrimonies
CREATE TABLE IF NOT EXISTS `patrimonies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `name` VARCHAR(150) DEFAULT NULL,
  `value` DECIMAL(14,2) NOT NULL,
  `type` VARCHAR(80) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== tabelas financeiras detalhadas (opcionais, presentes em `prospera_db.sql`)
CREATE TABLE IF NOT EXISTS `gastos_diretos` (
  `Gastos_Dir_User_Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Usuario_Id` INT NOT NULL,
  `Salario_Usuario` DECIMAL(14,2) DEFAULT 0,
  `Conta_De_Agua` DECIMAL(14,2) DEFAULT 0,
  `Conta_De_Luz` DECIMAL(14,2) DEFAULT 0,
  `Conta_De_Gas` DECIMAL(14,2) DEFAULT 0,
  `Conta_Aluguel` DECIMAL(14,2) DEFAULT 0,
  `Conta_DadosMoveis` DECIMAL(14,2) DEFAULT 0,
  `Conta_Wifi` DECIMAL(14,2) DEFAULT 0,
  `Conta_Streaming` DECIMAL(14,2) DEFAULT 0,
  FOREIGN KEY (`Usuario_Id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `gastos_indiretos` (
  `Gastos_Ind_User_Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Usuario_Id` INT NOT NULL,
  `Despesas_Mercado` DECIMAL(14,2) DEFAULT 0,
  `Despesas_Feira` DECIMAL(14,2) DEFAULT 0,
  `Despesas_Saude` DECIMAL(14,2) DEFAULT 0,
  `Despesas_Transporte` DECIMAL(14,2) DEFAULT 0,
  `Despesas_Educacao` DECIMAL(14,2) DEFAULT 0,
  `Despesas_Lazer` DECIMAL(14,2) DEFAULT 0,
  FOREIGN KEY (`Usuario_Id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `tributos` (
  `Trib_User_Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Usuario_Id` INT NOT NULL,
  `IPVA` DECIMAL(14,2) DEFAULT 0,
  `IPTU` DECIMAL(14,2) DEFAULT 0,
  `ISS` DECIMAL(14,2) DEFAULT 0,
  `IRRF_IRRJ` DECIMAL(14,2) DEFAULT 0,
  FOREIGN KEY (`Usuario_Id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `creditos` (
  `Cred_User_Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Usuario_Id` INT NOT NULL,
  `Credito_com_Saude` DECIMAL(14,2) DEFAULT 0,
  `Credito_com_VR` DECIMAL(14,2) DEFAULT 0,
  `Renda_Principal` DECIMAL(14,2) DEFAULT 0,
  `Renda_extra_Continua` DECIMAL(14,2) DEFAULT 0,
  `Renda_extra_Variada` DECIMAL(14,2) DEFAULT 0,
  `Rendimentos_Tributaveis` DECIMAL(14,2) DEFAULT 0,
  `Rendimentos_Nao_Tributaveis` DECIMAL(14,2) DEFAULT 0,
  FOREIGN KEY (`Usuario_Id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== metas financeiras (opcionais)
CREATE TABLE IF NOT EXISTS `meta_financeira` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `Usuario_Id` INT NOT NULL,
  `Nome_Meta` VARCHAR(150) NOT NULL,
  `Descricao_Meta` VARCHAR(255) DEFAULT NULL,
  `Tipo_Meta` ENUM('imovel','automovel') DEFAULT 'imovel',
  `Prioridade_Meta` ENUM('alta','media','baixa') DEFAULT 'media',
  `Status_Meta` ENUM('pendente','em progresso','concluida','cancelada') DEFAULT 'pendente',
  FOREIGN KEY (`Usuario_Id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `meta_financeira_detalhes` (
  `Meta_Detalhes_Id` INT AUTO_INCREMENT PRIMARY KEY,
  `Meta_Id` INT NOT NULL,
  `Usuario_Id` INT NOT NULL,
  `DataInicio_Meta` DATE DEFAULT NULL,
  `DataFim_Meta` DATE DEFAULT NULL,
  `ValorAtual_Meta` DECIMAL(14,2) DEFAULT 0,
  `ValorAlvo_Meta` DECIMAL(14,2) DEFAULT 0,
  `DataCriacao_Meta` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `DataAtualizacao_Meta` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `DataTermino_Meta` DATETIME DEFAULT NULL,
  FOREIGN KEY (`Meta_Id`) REFERENCES `meta_financeira`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`Usuario_Id`) REFERENCES `usuario`(`Usuario_Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===== índices úteis
CREATE INDEX IF NOT EXISTS `idx_transactions_user_date` ON `transactions` (`user_id`, `date`);
CREATE INDEX IF NOT EXISTS `idx_accounts_user` ON `accounts` (`user_id`);
CREATE INDEX IF NOT EXISTS `idx_goals_user` ON `goals` (`user_id`);

-- ===== exemplo (comentado) para inserir um usuário de teste
-- INSERT INTO usuario (Usuario_Nome, Usuario_CPF, Usuario_Email, Usuario_Senha) VALUES ('usuario_teste','00000000000','teste@exemplo.com','$2a$10$...hashedpassword');
