
import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css'; // Importa o CSS específico do Chatbot
import { AnimatePresence, motion } from 'framer-motion';
import lotusLogo from '../../assets/Img/lotus-assistente-img.png';

// Ícones Lucide (substituindo Font Awesome para consistência e modernidade)
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
const BotIcon = () => <img src={lotusLogo} alt="Lótus" className="w-6 h-6 rounded-full" />;

const Chatbot = ({ isOpen, onClose, startFlow }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [flowState, setFlowState] = useState(null); // Controla o estado do fluxo de conversação
  const [currentFlowType, setCurrentFlowType] = useState(null); // Armazena o tipo de fluxo atual
  const messagesEndRef = useRef(null);

  // Efeitos para scrollar para o final das mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Função para adicionar mensagem (usuário ou bot)
  const addMessage = (text, sender, options = []) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender, options, timestamp: new Date() }]);
  };

  // Função para adicionar mensagem do bot com delay e typing indicator
  const addBotMessage = (text, options = []) => {
    setIsTyping(true);
    setTimeout(() => {
      addMessage(text, 'bot', options);
      setIsTyping(false);
    }, 1000 + Math.random() * 500); // Delay para simular digitação
  };

  // Lógica para iniciar um fluxo de conversação
  const startChatFlow = (flowType) => {
    setMessages([]); // Limpa mensagens anteriores
    setCurrentFlowType(flowType);
    setFlowState({ type: flowType, step: 0 });

    let initialMessage = '';
    switch (flowType) {
      case 'me_roubaram':
        initialMessage = "Lamento muito pelo ocorrido. Para iniciar o processo de bloqueio e denúncia, preciso de algumas informações. Por favor, digite seu e-mail.";
        break;
      case 'denuncias':
        initialMessage = "Para registrar sua denúncia, por favor, digite seu e-mail.";
        break;
      case 'protecao':
        initialMessage = "Para acessar a central de proteção e verificar suas opções, por favor, digite seu e-mail.";
        break;
      case 'atendimento':
        initialMessage = "Para direcionar você ao canal de atendimento correto, por favor, digite seu e-mail.";
        break;
      case 'cancelar_conta':
        initialMessage = "Entendo que você queira cancelar sua conta. Para prosseguir, por favor, digite seu e-mail.";
        break;
      default:
        initialMessage = "Olá! Sou a Lótus, sua assistente virtual. Como posso ajudar você hoje?";
        break;
    }
    addBotMessage(initialMessage);
  };

  // Efeito para iniciar o chatbot ou um fluxo específico
  useEffect(() => {
    if (isOpen) {
      if (startFlow && startFlow !== currentFlowType) {
        // Inicia um fluxo específico se for diferente do atual
        startChatFlow(startFlow);
      } else if (messages.length === 0) {
        // Mensagem de boas-vindas inicial se não houver mensagens
        addBotMessage("Olá! Sou a Lótus, sua assistente virtual. Como posso ajudar você hoje?", [
          { text: "Me Roubaram", action: "me_roubaram" },
          { text: "Canal de Denúncias", action: "denuncias" },
          { text: "Central de Proteção", action: "protecao" },
          { text: "Canais de Atendimento", action: "atendimento" },
          { text: "Cancelar Minha Conta", action: "cancelar_conta" },
        ]);
      }
    } else {
      // Reseta o estado do chatbot quando ele é fechado
      setMessages([]);
      setInput('');
      setIsTyping(false);
      setFlowState(null);
      setCurrentFlowType(null);
    }
  }, [isOpen, startFlow]); // Dependências para re-executar o efeito

  // Lógica para gerar um número de protocolo aleatório
  const generateProtocol = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let protocol = '';
    for (let i = 0; i < 10; i++) {
      protocol += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return protocol;
  };

  // Lógica para processar a entrada do usuário
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    addMessage(input, 'user');
    const userMessage = input.trim();
    setInput('');

    if (flowState) {
      processFlowMessage(userMessage);
    } else {
      // Respostas padrão ou menu principal se não estiver em um fluxo específico
      addBotMessage("Desculpe, não entendi. Você gostaria de iniciar um dos atendimentos abaixo?", [
        { text: "Me Roubaram", action: "me_roubaram" },
        { text: "Canal de Denúncias", action: "denuncias" },
        { text: "Central de Proteção", action: "protecao" },
        { text: "Canais de Atendimento", action: "atendimento" },
        { text: "Cancelar Minha Conta", action: "cancelar_conta" },
      ]);
    }
  };

  // Lógica para processar mensagens dentro de um fluxo
  const processFlowMessage = (message) => {
    let nextFlowState = { ...flowState };
    let botResponse = '';
    let options = [];

    switch (flowState.type) {
      case 'me_roubaram':
      case 'denuncias':
      case 'protecao':
      case 'atendimento':
      case 'cancelar_conta':
        switch (flowState.step) {
          case 0: // Pedindo e-mail
            // Validação simples de e-mail
            if (/\S+@\S+\.\S+/.test(message)) {
              nextFlowState.email = message;
              nextFlowState.step = 1;
              botResponse = "Obrigado. Agora, por favor, digite sua senha para confirmar sua identidade.";
            } else {
              botResponse = "Por favor, digite um e-mail válido.";
            }
            break;
          case 1: // Pedindo senha
            // Validação simples de senha (apenas verifica se não está vazia)
            if (message.length > 0) {
              nextFlowState.password = message;
              nextFlowState.step = 2;
              botResponse = "Senha confirmada. Por favor, descreva detalhadamente o ocorrido.";
            } else {
              botResponse = "Por favor, digite sua senha.";
            }
            break;
          case 2: // Pedindo descrição do ocorrido
            if (message.length > 0) {
              nextFlowState.description = message;
              nextFlowState.step = 3;
              const protocol = generateProtocol();
              nextFlowState.protocol = protocol;
              botResponse = `Certo. Seu atendimento foi registrado com o protocolo **${protocol}**. Nossa equipe analisará seu caso e entrará em contato em breve. O tempo estimado de resposta é de 24 a 48 horas úteis. Precisa de mais alguma coisa?`;
              options = [
                { text: "Sim, preciso de mais ajuda", action: "restart" },
                { text: "Não, obrigado", action: "close_chat" },
              ];
            } else {
              botResponse = "Por favor, descreva o ocorrido para que eu possa registrar.";
            }
            break;
          case 3: // Após gerar protocolo, aguardando ação do usuário
            if (message === "restart") {
              botResponse = "Certo, como posso ajudar você agora?";
              options = [
                { text: "Me Roubaram", action: "me_roubaram" },
                { text: "Canal de Denúncias", action: "denuncias" },
                { text: "Central de Proteção", action: "protecao" },
                { text: "Canais de Atendimento", action: "atendimento" },
                { text: "Cancelar Minha Conta", action: "cancelar_conta" },
              ];
              nextFlowState = null; // Reseta o fluxo
              setCurrentFlowType(null);
            } else if (message === "close_chat") {
              botResponse = "Agradeço o contato. Se precisar de algo mais, estarei aqui!";
              onClose(); // Fecha o chatbot
              nextFlowState = null; // Reseta o fluxo
              setCurrentFlowType(null);
            } else {
              botResponse = "Você gostaria de iniciar um novo atendimento ou encerrar o chat?";
              options = [
                { text: "Sim, preciso de mais ajuda", action: "restart" },
                { text: "Não, obrigado", action: "close_chat" },
              ];
            }
            break;
          default:
            botResponse = "Houve um erro no fluxo. Por favor, tente novamente.";
            nextFlowState = null; // Reseta o fluxo
            setCurrentFlowType(null);
            break;
        }
        break;
      default:
        botResponse = "Desculpe, não entendi. Você gostaria de iniciar um dos atendimentos abaixo?";
        options = [
          { text: "Me Roubaram", action: "me_roubaram" },
          { text: "Canal de Denúncias", action: "denuncias" },
          { text: "Central de Proteção", action: "protecao" },
          { text: "Canais de Atendimento", action: "atendimento" },
          { text: "Cancelar Minha Conta", action: "cancelar_conta" },
        ];
        nextFlowState = null; // Reseta o fluxo
        setCurrentFlowType(null);
        break;
    }

    setFlowState(nextFlowState);
    addBotMessage(botResponse, options);
  };

  // Lógica para lidar com cliques nos botões de opção
  const handleOptionClick = (action) => {
    let userOptionText = action;
    // Mapeia as ações para o texto exibido ao usuário
    const actionToTextMap = {
      "me_roubaram": "Me Roubaram",
      "denuncias": "Canal de Denúncias",
      "protecao": "Central de Proteção",
      "atendimento": "Canais de Atendimento",
      "cancelar_conta": "Cancelar Minha Conta",
      "restart": "Sim, preciso de mais ajuda",
      "close_chat": "Não, obrigado",
    };
    userOptionText = actionToTextMap[action] || action;

    addMessage(userOptionText, 'user'); // Exibe a ação como mensagem do usuário
    if (flowState) {
      processFlowMessage(action); // Continua o fluxo com a ação
    } else {
      startChatFlow(action); // Inicia um novo fluxo
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="chatbot-window"
    >
      <div className="chatbot-header">
        <div className="chatbot-header-title">
          <BotIcon />
          <h3>Lótus Atendimento</h3>
        </div>
        <button onClick={onClose} className="chatbot-close-button" aria-label="Fechar chat">
          <CloseIcon />
        </button>
      </div>
      <div className="chatbot-messages-area">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`message-bubble ${msg.sender}`}
            >
              <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
              {msg.options && msg.options.length > 0 && msg.sender === 'bot' && (
                <div className="chatbot-options-area">
                  {msg.options.map((option, optIndex) => (
                    <button key={optIndex} className="option-button" onClick={() => handleOptionClick(option.action)}>
                      {option.text}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="message-bubble bot typing-indicator"
          >
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-footer">
        <form onSubmit={handleSendMessage} className="chatbot-input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={isTyping} // Desabilita input enquanto o bot está digitando
          />
          <button type="submit" className="chatbot-send-button" disabled={isTyping} aria-label="Enviar mensagem">
            <SendIcon />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Chatbot;

