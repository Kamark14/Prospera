create database prospera_db;
use prospera_db;



-- tabela de cadastro dos usuarios
create table usuario (
	Usuario_Id INT AUTO_INCREMENT PRIMARY KEY,
	image_profile VARCHAR(255),
	Usuario_Nome VARCHAR(100) NOT NULL UNIQUE,
    Usuario_CPF VARCHAR(100) NOT NULL UNIQUE,
    Usuario_Email VARCHAR(100) NOT NULL UNIQUE,
    Usuario_Senha VARCHAR(255) NOT NULL
);

insert into usuario ( Usuario_Nome, Usuario_CPF, Usuario_Email, Usuario_Senha)
 VALUES ('kauã', '78432599512', 'kaua@gmail', '123456');

select * from usuario;

-- tabela de perfil dos administradores
create table admin_perfil (
    Admin_Id INT AUTO_INCREMENT PRIMARY KEY,
    Admin_Nome VARCHAR(100) NOT NULL,
    Admin_Email VARCHAR(100) NOT NULL UNIQUE,
    Admin_Senha VARCHAR(255) NOT NULL
);

insert into admin_perfil (Admin_Nome, Admin_Email, Admin_Senha) values ('kadmin', 'kaua@gmail.com', 'admin123');

select * from admin_perfil;

-- Tabela de Informações do Usuario
create table usuario_info (
    Usuario_Info_Id INT AUTO_INCREMENT PRIMARY KEY,
    Usuario_Endereco VARCHAR(255) NOT NULL,
    Usuario_Cidade VARCHAR(100) NOT NULL,
    Usuario_Estado VARCHAR(100) NOT NULL,
    Usuario_CEP VARCHAR(20) NOT NULL,
    Usuario_Pais VARCHAR(100) NOT NULL,
    Usuario_Telefone VARCHAR(15) NOT NULL,
    Usuario_Profissao VARCHAR(255) NOT NULL,
    Usuario_Emprego_Atual VARCHAR(255) NOT NULL,
    Usuario_Dia_De_Pagamento DATE NOT NULL,
    Usuario_Salario DECIMAL(10,2) NOT NULL,
    Usuario_Data_Nascimento DATE NOT NULL,
    Usuario_Renda_Mensal_Fixa DECIMAL(10,2) NOT NULL,
    Usuario_Renda_Extra DECIMAL(10,2) NOT NULL
);

insert into usuario_info ( Usuario_Endereco, Usuario_Cidade, Usuario_Estado, Usuario_CEP, Usuario_Pais, Usuario_Telefone, Usuario_Profissao,  Usuario_Emprego_Atual, Usuario_Dia_De_Pagamento, Usuario_Salario, Usuario_Data_Nascimento, Usuario_Renda_Mensal_Fixa, Usuario_Renda_Extra)
 VALUES ('paulistano', 'São Paulo', 'São Paulo', '45645-60', 'Brasil', '1199999999', 'Programador', 'Estudante', '2025-09-04', 1200, '2000-01-01', 1200, 0);

select * from usuario_info;

-- Tabelas de Dados de Debitos do Usuario

-- Tabela de Gastos Diretos
CREATE TABLE gastos_diretos (
    Gastos_Dir_User_Id INT AUTO_INCREMENT PRIMARY KEY,
    Usuario_Id INT NOT NULL,
    Salario_Usuario DECIMAL(10,2) NOT NULL,
    Conta_De_Agua DECIMAL(10,2) NOT NULL,
    Conta_De_Luz DECIMAL(10,2) NOT NULL,
    Conta_De_Gas DECIMAL(10,2) NOT NULL,
    Conta_Aluguel DECIMAL(10,2) NOT NULL,
    Conta_DadosMoveis DECIMAL(10,2) NOT NULL,
    Conta_Wifi DECIMAL(10,2) NOT NULL,
    Conta_Streaming DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Usuario_Id) REFERENCES usuario(Usuario_Id)
    );
    
-- Tabela de Gastos Indiretos
create table gastos_indiretos (
	Gastos_Ind_User_Id INT AUTO_INCREMENT PRIMARY KEY,
    Usuario_Id INT NOT NULL,
    Despesas_Mercado DECIMAL(10,2) NOT NULL,
    Despesas_Feira DECIMAL(10,2) NOT NULL,
    Despesas_Saude DECIMAL(10,2) NOT NULL,
    Despesas_Transporte DECIMAL(10,2) NOT NULL,
	Despesas_Educacao DECIMAL(10,2) NOT NULL,
    Despesas_Lazer DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Usuario_Id) REFERENCES usuario(Usuario_Id)
);

-- Tabela de Tributos
create table tributos (
	Trib_User_Id INT AUTO_INCREMENT PRIMARY KEY,
    Usuario_Id INT NOT NULL,
	IPVA DECIMAL(10,2) NOT NULL,
    IPTU DECIMAL(10,2) NOT NULL,
	ISS DECIMAL(10,2) NOT NULL,
    IRRF_IRRJ DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Usuario_Id) REFERENCES usuario(Usuario_Id)
);

-- Tabelas de Dados de Créditos do Usuario
create table creditos (
	Cred_User_Id INT AUTO_INCREMENT PRIMARY KEY,
    Usuario_Id INT NOT NULL,
	Credito_com_Saude DECIMAL(10,2) NOT NULL,
    Credito_com_VR DECIMAL(10,2) NOT NULL,
    Renda_Principal DECIMAL(10,2) NOT NULL,
    Renda_extra_Continua DECIMAL(10,2) NOT NULL,
    Renda_extra_Variada DECIMAL(10,2) NOT NULL,
    Rendimentos_Tributaveis DECIMAL(10,2) NOT NULL,
    Rendimentos_Nao_Tributaveis DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Usuario_Id) REFERENCES usuario(Usuario_Id)
);

-- Tabela de meta financeira
CREATE TABLE meta_financeira (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Usuario_Id INT NOT NULL,
    Nome_Meta VARCHAR(100) NOT NULL,
    Descricao_Meta VARCHAR(255) NOT NULL,
    Tipo_Meta ENUM('imovel', 'automovel') NOT NULL,
    Prioridade_Meta ENUM('alta', 'media', 'baixa') NOT NULL,
    Status_Meta ENUM('pendente', 'em progresso', 'concluida', 'cancelada') NOT NULL DEFAULT 'pendente',
    FOREIGN KEY (Usuario_Id) REFERENCES usuario(Usuario_Id)
);

-- Tabela de detalhes da meta financeira
CREATE TABLE meta_financeira_detalhes (
    Meta_Id INT NOT NULL,
    Usuario_Id INT NOT NULL,
    FOREIGN KEY (Meta_Id) REFERENCES meta_financeira(id),
    Meta_Detalhes_Id INT AUTO_INCREMENT PRIMARY KEY,
    DataInicio_Meta DATE NOT NULL,
    DataFim_Meta DATE NOT NULL,
    ValorAtual_Meta DECIMAL(10,2) DEFAULT 0,
    ValorAlvo_Meta DECIMAL(10,2) NOT NULL,
    DataCriacao_Meta DATETIME DEFAULT CURRENT_TIMESTAMP,
    DataAtualizacao_Meta DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    DataTermino_Meta DATETIME DEFAULT NULL,
    FOREIGN KEY (Usuario_Id) REFERENCES usuario(Usuario_Id)
);
