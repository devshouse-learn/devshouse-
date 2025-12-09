import { useState } from 'react';
import './AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: '¡Hola! Soy tu asistente de DEVSHOUSE. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const quickOptions = [
    '¿Cómo registrar un convenio?',
    '¿Cómo publicar mi emprendimiento?',
    '¿Cómo buscar empleo?',
    'Reportar un problema'
  ];

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleQuickOption = (option) => {
    handleSendMessage(option);
  };

  const handleSendMessage = (messageText = inputValue) => {
    if (!messageText.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      text: messageText
    };
    setMessages(prev => [...prev, userMessage]);

    // Clear input
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAIResponse(messageText);
      setMessages(prev => [...prev, {
        type: 'ai',
        text: aiResponse
      }]);
    }, 1000);
  };

  const getAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('convenio') || lowerMessage.includes('colegio')) {
      return 'Para registrar un convenio educativo, haz clic en "Convenios con Colegios" en la página principal. Deberás proporcionar información sobre tu institución, el tipo de programa que deseas implementar y los datos de contacto. Nuestros programas incluyen capacitación en Visual Studio Code, Git, API REST e IA.';
    } else if (lowerMessage.includes('emprendimiento') || lowerMessage.includes('empresa')) {
      return 'Para publicar tu emprendimiento, selecciona "Emprendimientos" en la página principal. Podrás registrar tu empresa, describir tus servicios o productos, y conectar con potenciales inversores y clientes. También ofrecemos asistencia de IA para optimizar tu emprendimiento.';
    } else if (lowerMessage.includes('empleo') || lowerMessage.includes('trabajo') || lowerMessage.includes('vacante')) {
      return 'Tenemos dos opciones: Si eres empresa y quieres publicar una vacante, selecciona "Soy Empresa". Si estás buscando trabajo, elige "Busco Empleo". Nuestra IA te ayudará a encontrar el mejor match entre candidatos y empresas.';
    } else if (lowerMessage.includes('problema') || lowerMessage.includes('error') || lowerMessage.includes('caída')) {
      return 'Lamento que estés experimentando problemas. Por favor, describe el error específico que estás enfrentando. ¿Es un problema de acceso, registro, o funcionalidad? Mientras tanto, puedes contactarnos directamente a través de nuestras redes sociales en el pie de página.';
    } else if (lowerMessage.includes('ayuda') || lowerMessage.includes('hola') || lowerMessage.includes('información')) {
      return 'Estoy aquí para ayudarte con: 1) Registro de convenios educativos, 2) Publicación de emprendimientos, 3) Ofertas de empleo (publicar o buscar), 4) Resolución de problemas técnicos. ¿Qué te gustaría saber?';
    } else {
      return 'Gracias por tu mensaje. Estoy aquí para ayudarte con convenios educativos, emprendimientos y ofertas de empleo. ¿Podrías especificar un poco más tu consulta? También puedes usar las opciones rápidas arriba para obtener información específica.';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button 
        className={`ai-chat-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label="Asistente de IA"
      >
        {isOpen ? '' : ''}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="chat-header">
            <div className="header-info">
              <span className="bot-icon"></span>
              <div>
                <h3>Asistente DEVSHOUSE</h3>
                <span className="status"> En línea</span>
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}></button>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.type === 'ai' ? 'ai-message' : 'user-message'}`}
              >
                {message.type === 'ai' && <span className="message-icon"></span>}
                <div className="message-bubble">
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="quick-options">
            {quickOptions.map((option, index) => (
              <button
                key={index}
                className="quick-option-btn"
                onClick={() => handleQuickOption(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button onClick={() => handleSendMessage()}>Enviar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
