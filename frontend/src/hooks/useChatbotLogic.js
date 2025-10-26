import { useState, useEffect, useRef } from 'react';

const useChatbotLogic = () => {
  const [chatMessages, setChatMessages] = useState([
    { text: "Olá! Sou a Lótus, sua assistente virtual. Como posso ajudar você hoje?", isUser: false }
  ]);
  const [chatContext, setChatContext] = useState('initial');
  const [userData, setUserData] = useState({ email: '', issueType: '' });
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  const addMessage = (message, isUser = false) => {
    setChatMessages(prev => [...prev, { text: message, isUser }]);
  };

  const botResponse = (message, delay = 1000) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addMessage(message);
    }, delay);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const resetContext = () => {
    setChatContext('initial');
    setUserData({ email: '', issueType: '' });
    botResponse("Posso ajudar com algo mais? Escolha uma opção ou digite sua pergunta.", 500);
  };

  const processUserInput = (input) => {
    const lowerInput = input.toLowerCase();

    switch (chatContext) {
      case "initial":
        if (lowerInput.includes("denúncia") || lowerInput.includes("denuncia")) {
          setUserData(prev => ({ ...prev, issueType: "denúncia" }));
          setChatContext("awaiting_email");
          botResponse("Para registrar sua denúncia, por favor, informe seu e-mail:");
        } else if (lowerInput.includes("roubo") || lowerInput.includes("furto")) {
          setUserData(prev => ({ ...prev, issueType: "roubo/furto" }));
          setChatContext("awaiting_email");
          botResponse("Para reportar roubo/furto, por favor, informe seu e-mail:");
        } else if (lowerInput.includes("cancelar") || lowerInput.includes("conta")) {
          setUserData(prev => ({ ...prev, issueType: "cancelamento" }));
          setChatContext("awaiting_email");
          botResponse("Para cancelar sua conta, por favor, informe seu e-mail:");
        } else if (lowerInput.includes("olá") || lowerInput.includes("oi") || lowerInput.includes("bom dia") || lowerInput.includes("boa tarde") || lowerInput.includes("boa noite")) {
          botResponse("Olá! Como posso ajudar você hoje? Escolha uma opção ou digite sua pergunta.");
        } else {
          botResponse("Desculpe, não entendi. Por favor, escolha uma das opções abaixo ou digite sua pergunta.");
        }
        break;

      case "awaiting_email":
        if (isValidEmail(input)) {
          setUserData(prev => ({ ...prev, email: input }));
          setChatContext("awaiting_issue_details");
          botResponse("Obrigado. Agora, por favor, descreva brevemente o ocorrido ou sua solicitação:");
        } else {
          botResponse("Por favor, insira um e-mail válido para prosseguir.");
        }
        break;

      case "awaiting_issue_details":
        if (input.length > 15) { // Aumentado o mínimo para 15 caracteres para mais detalhes
          const protocolo = Math.floor(10000 + Math.random() * 90000); // número de 5 dígitos
          botResponse(`Obrigado pelas informações. Sua solicitação de ${userData.issueType} foi registrada com o protocolo #${protocolo}. Nossa equipe entrará em contato no e-mail ${userData.email} em até 48 horas úteis.`);
          setTimeout(() => {
            resetContext();
          }, 2000);
        } else {
          botResponse("Por favor, forneça mais detalhes sobre o ocorrido ou sua solicitação.");
        }
        break;

      default:
        botResponse("Desculpe, não entendi. Poderia repetir ou escolher uma das opções?");
    }
  };

  return {
    chatMessages,
    chatContext,
    typing,
    messagesEndRef,
    addMessage,
    botResponse,
    processUserInput,
    resetContext,
    setChatContext,
    setUserData
  };
};

export default useChatbotLogic;

