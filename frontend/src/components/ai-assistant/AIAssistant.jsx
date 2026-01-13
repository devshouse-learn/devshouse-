import { useState } from 'react';
import './AIAssistant.css';
import { useAuth } from '../../context/AuthContext';

const AIAssistant = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: '¡Hola! Soy tu asistente de DEVSHOUSE. ¿En qué puedo ayudarte hoy?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  // Preguntas rápidas según estado de autenticación
  const quickOptions = user && user.id ? [
    '¿Cómo registrar un convenio?',
    '¿Cómo publicar mi emprendimiento?',
    '¿Cómo buscar empleo?',
    'Reportar un problema'
  ] : [
    '¿Cómo me registro?',
    '¿Qué es DEVSHOUSE?',
    '¿Necesito ayuda con el inicio de sesión?',
    '¿Qué servicios ofrecen?'
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
    const isUserLogged = user && user.id;

    // Preguntas para usuarios NO autenticados
    if (!isUserLogged) {
      if (lowerMessage.includes('registro') || lowerMessage.includes('registr')) {
        return 'Para registrarte en DEVSHOUSE, haz clic en el botón "Registrarse" en la parte superior derecha. Deberás proporcionar tu correo electrónico y crear una contraseña segura. Una vez registrado, podrás acceder a todas nuestras funcionalidades y servicios.';
      } else if (lowerMessage.includes('devshouse') || lowerMessage.includes('qué')) {
        return 'DEVSHOUSE es una plataforma educativa y de empleo que conecta instituciones educativas, emprendedores y buscadores de empleo. Ofrecemos programas de capacitación en tecnología, espacios para publicar emprendimientos y ofertas de trabajo. ¡Únete ahora para ser parte de nuestra comunidad!';
      } else if (lowerMessage.includes('sesión') || lowerMessage.includes('login') || lowerMessage.includes('iniciar')) {
        return 'Para iniciar sesión, haz clic en el botón "Iniciar Sesión" en la parte superior derecha. Usa el correo electrónico y contraseña con los que te registraste. Si olvidaste tu contraseña, ponte en contacto con nuestro equipo a través de nuestras redes sociales.';
      } else if (lowerMessage.includes('servicio') || lowerMessage.includes('ofrecen')) {
        return 'DEVSHOUSE ofrece: 1) Convenios con instituciones educativas para capacitación en tecnología, 2) Espacios para publicar y promocionar emprendimientos, 3) Plataforma de empleo para buscar y publicar ofertas de trabajo, 4) Asistencia de IA para todas tus consultas. ¡Regístrate para acceder a todo esto!';
      } else {
        return 'Bienvenido a DEVSHOUSE. Para poder acceder a todas nuestras funcionalidades, necesitas registrarte o iniciar sesión. ¿Deseas saber cómo registrarte o tienes preguntas sobre nuestros servicios?';
      }
    }

    // Preguntas para usuarios autenticados
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
      {/* Chat Button - solo visible cuando el chat está cerrado */}
      {!isOpen && (
        <button 
          className="ai-chat-button"
          onClick={toggleChat}
          aria-label="Asistente de IA"
        >
          💬
        </button>
      )}

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
            <button className="close-btn" onClick={toggleChat} title="Cerrar">✕</button>
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
