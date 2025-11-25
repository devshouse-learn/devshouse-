import React, { useState, useEffect, useRef } from 'react';
import './AIAssistantEnhanced.css';

const AIAssistantEnhanced = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quickFixes, setQuickFixes] = useState([]);
  const [activeTab, setActiveTab] = useState('chat'); // chat, fixes, errors
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Solo ejecutar una vez al montar el componente
    if (!hasInitialized.current) {
      // Cargar soluciones rápidas
      loadQuickFixes();
      
      // Mensaje de bienvenida
      addMessage('¡Hola! 👋 Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?', 'ai');
      
      hasInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadQuickFixes = async () => {
    try {
      // Comentado temporalmente hasta que el backend esté listo
      // const response = await fetch('/api/ai-assistant/quick-fixes');
      // const data = await response.json();
      // if (data.success) {
      //   setQuickFixes(data.data);
      // }
      
      // Datos de ejemplo para desarrollo
      setQuickFixes([
        { id: 1, title: '¿Cómo registrarme?', description: 'Información sobre el registro' },
        { id: 2, title: '¿Cómo publicar empleos?', description: 'Guía para publicar ofertas' },
        { id: 3, title: '¿Cómo buscar trabajo?', description: 'Usar el buscador de empleos' }
      ]);
    } catch (error) {
      console.error('Error cargando soluciones rápidas:', error);
    }
  };

  const addMessage = (content, sender = 'user', data = null) => {
    const message = {
      id: Date.now(),
      content,
      sender,
      timestamp: new Date().toISOString(),
      data
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    addMessage(userMessage, 'user');
    setInput('');
    setIsLoading(true);

    try {
      // Detectar intención del mensaje
      const intent = detectIntent(userMessage);

      if (intent === 'help') {
        await handleHelpRequest(userMessage);
      } else if (intent === 'error') {
        await handleErrorDiagnosis(userMessage);
      } else if (intent === 'fix') {
        await handleFixRequest(userMessage);
      } else {
        await handleGeneralQuery(userMessage);
      }
    } catch (error) {
      addMessage('❌ Ocurrió un error al procesar tu solicitud. Por favor, intenta de nuevo.', 'ai');
      console.error('Error en asistente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const detectIntent = (message) => {
    const lower = message.toLowerCase();
    
    if (lower.includes('error') || lower.includes('problema') || lower.includes('no funciona')) {
      return 'error';
    }
    if (lower.includes('cómo') || lower.includes('ayuda') || lower.includes('qué es')) {
      return 'help';
    }
    if (lower.includes('arreglar') || lower.includes('solucionar') || lower.includes('fix')) {
      return 'fix';
    }
    return 'general';
  };

  const handleHelpRequest = async (_query) => {
    try {
      // Comentado temporalmente hasta que el backend esté listo
      // const response = await fetch('/api/ai-assistant/help', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ query })
      // });
      // const data = await response.json();
      
      // Respuesta simulada para desarrollo
      const data = {
        success: true,
        data: {
          suggestions: [
            {
              category: 'ayuda',
              solutions: [
                {
                  problem: 'Información general',
                  fixes: [
                    'DevsHouse es una plataforma de conexión educativa y laboral',
                    'Puedes registrarte como usuario, moderador o administrador',
                    'Explora las secciones de Convenios, Emprendimientos y Empleos'
                  ]
                }
              ]
            }
          ],
          relatedTopics: ['Registro', 'Perfil de usuario', 'Publicar contenido']
        }
      };
      
      if (data.success && data.data.suggestions.length > 0) {
        let helpMessage = '📚 Aquí está lo que encontré:\n\n';
        
        data.data.suggestions.forEach(suggestion => {
          helpMessage += `**${suggestion.category.toUpperCase()}**\n`;
          suggestion.solutions.forEach(sol => {
            helpMessage += `\n• ${sol.problem}\n`;
            sol.fixes.forEach(fix => {
              helpMessage += `  - ${fix}\n`;
            });
          });
          helpMessage += '\n';
        });

        if (data.data.relatedTopics.length > 0) {
          helpMessage += '\n**Temas relacionados:**\n';
          data.data.relatedTopics.forEach(topic => {
            helpMessage += `• ${topic}\n`;
          });
        }

        addMessage(helpMessage, 'ai', data.data);
      } else {
        addMessage('No encontré información específica sobre eso, pero puedo ayudarte con:\n\n• Problemas de autenticación\n• Errores de conexión\n• Problemas de base de datos\n• Errores de frontend\n• Configuración CORS\n\n¿Sobre cuál quieres saber más?', 'ai');
      }
    } catch (error) {
      console.error('Error en ayuda:', error);
      addMessage('No pude obtener ayuda en este momento. ¿Podrías ser más específico sobre tu problema?', 'ai');
    }
  };

  const handleErrorDiagnosis = async (_description) => {
    try {
      // Comentado temporalmente hasta que el backend esté listo
      // const response = await fetch('/api/ai-assistant/diagnose', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     error: {
      //       message: description,
      //       name: 'UserReportedError'
      //     },
      //     context: {
      //       source: 'user-report',
      //       userAgent: navigator.userAgent
      //     }
      //   })
      // });
      // const data = await response.json();
      
      // Respuesta simulada para desarrollo
      const data = {
        success: true,
        data: {
          possibleCauses: [
            'Error de conexión con el servidor',
            'Token de autenticación expirado',
            'Problema de configuración en el frontend'
          ],
          recommendations: [
            'Verifica tu conexión a internet',
            'Intenta cerrar sesión y volver a iniciar',
            'Limpia el caché del navegador',
            'Recarga la página (Ctrl+R o Cmd+R)',
            'Contacta al soporte si el problema persiste'
          ]
        }
      };
      
      if (data.success) {
        const diagnosis = data.data;
        let diagnosisMessage = '🔍 **Diagnóstico:**\n\n';

        if (diagnosis.possibleCauses.length > 0) {
          diagnosisMessage += '**Posibles causas:**\n';
          diagnosis.possibleCauses.forEach(cause => {
            diagnosisMessage += `• ${cause}\n`;
          });
          diagnosisMessage += '\n';
        }

        if (diagnosis.recommendations.length > 0) {
          diagnosisMessage += '**Recomendaciones:**\n';
          diagnosis.recommendations.slice(0, 5).forEach((rec, idx) => {
            diagnosisMessage += `${idx + 1}. ${rec}\n`;
          });
          diagnosisMessage += '\n';
        }

        diagnosisMessage += `**Severidad:** ${getSeverityEmoji(diagnosis.severity)} ${diagnosis.severity}\n`;
        diagnosisMessage += `**Categoría:** ${diagnosis.category}\n`;

        if (diagnosis.autoFixAvailable) {
          diagnosisMessage += '\n✨ **Hay una solución automática disponible**. ¿Quieres que la aplique?';
        }

        addMessage(diagnosisMessage, 'ai', diagnosis);
      }
    } catch (error) {
      console.error('Error en diagnóstico:', error);
      addMessage('No pude diagnosticar el error automáticamente. ¿Puedes darme más detalles?', 'ai');
    }
  };

  const handleFixRequest = async () => {
    addMessage('🔧 Aquí están las soluciones rápidas más comunes. Selecciona una del panel de "Soluciones Rápidas" para ver los pasos detallados.', 'ai');
    setActiveTab('fixes');
  };

  const handleGeneralQuery = async (query) => {
    // Respuestas para preguntas comunes
    const responses = {
      'login': 'Para problemas de login:\n1. Verifica tu correo y contraseña\n2. Limpia el caché del navegador\n3. Intenta resetear tu contraseña\n4. Si persiste, limpia localStorage: localStorage.clear()',
      'servidor': 'Para problemas con el servidor:\n1. Verifica que el backend esté ejecutándose (puerto 3000)\n2. Revisa la consola del backend para errores\n3. Verifica la conexión a MongoDB\n4. Reinicia el servidor si es necesario',
      'base de datos': 'Para problemas de base de datos:\n1. Verifica que MongoDB esté ejecutándose\n2. Revisa MONGODB_URI en .env\n3. Comprueba las credenciales\n4. Verifica la conexión a internet (si usas Atlas)',
    };

    const lowerQuery = query.toLowerCase();
    let response = null;

    for (const [key, value] of Object.entries(responses)) {
      if (lowerQuery.includes(key)) {
        response = value;
        break;
      }
    }

    if (response) {
      addMessage(response, 'ai');
    } else {
      addMessage('Puedo ayudarte con:\n\n• 🔐 Problemas de autenticación\n• 🌐 Errores de conexión\n• 💾 Problemas de base de datos\n• ⚛️ Errores de frontend\n• 🔧 Configuración del sistema\n\n¿Con cuál necesitas ayuda?', 'ai');
    }
  };

  const getSeverityEmoji = (severity) => {
    const emojis = {
      low: '🟢',
      medium: '🟡',
      high: '🟠',
      critical: '🔴',
      unknown: '⚪'
    };
    return emojis[severity] || '⚪';
  };

  const applyQuickFix = (fix) => {
    let message = `**${fix.title}**\n\n${fix.description}\n\n**Pasos:**\n`;
    fix.steps.forEach((step, idx) => {
      message += `${idx + 1}. ${step}\n`;
    });
    message += `\n**Categoría:** ${fix.category}\n`;
    message += `**Dificultad:** ${fix.difficulty}`;

    addMessage(message, 'ai', fix);
    setActiveTab('chat');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button 
        className={`ai-assistant-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Asistente IA"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Panel del asistente */}
      {isOpen && (
        <div className="ai-assistant-panel">
          {/* Header */}
          <div className="ai-assistant-header">
            <div className="ai-assistant-title">
              <span className="ai-icon">🤖</span>
              <h3>Asistente IA</h3>
              <span className="ai-status">●</span>
            </div>
            <div className="ai-assistant-tabs">
              <button 
                className={activeTab === 'chat' ? 'active' : ''}
                onClick={() => setActiveTab('chat')}
              >
                💬 Chat
              </button>
              <button 
                className={activeTab === 'fixes' ? 'active' : ''}
                onClick={() => setActiveTab('fixes')}
              >
                🔧 Soluciones
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="ai-assistant-content">
            {activeTab === 'chat' && (
              <>
                {/* Messages */}
                <div className="ai-messages">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`ai-message ${message.sender}`}
                    >
                      <div className="message-content">
                        {message.content.split('\n').map((line, idx) => {
                          // Formatear markdown básico
                          let formattedLine = line;
                          
                          // Negrita
                          formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                          
                          // Código inline
                          formattedLine = formattedLine.replace(/`(.*?)`/g, '<code>$1</code>');

                          return (
                            <p 
                              key={idx} 
                              dangerouslySetInnerHTML={{ __html: formattedLine }}
                            />
                          );
                        })}
                      </div>
                      <div className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="ai-message ai">
                      <div className="message-content">
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="ai-input-container">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe tu problema o pregunta..."
                    rows="2"
                    disabled={isLoading}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="send-button"
                  >
                    ➤
                  </button>
                </div>
              </>
            )}

            {activeTab === 'fixes' && (
              <div className="quick-fixes-panel">
                <h4>🔧 Soluciones Rápidas</h4>
                <p className="quick-fixes-description">
                  Selecciona una solución para ver los pasos detallados
                </p>
                <div className="quick-fixes-list">
                  {quickFixes.map(fix => (
                    <div 
                      key={fix.id} 
                      className="quick-fix-card"
                      onClick={() => applyQuickFix(fix)}
                    >
                      <h5>{fix.title}</h5>
                      <p>{fix.description}</p>
                      <div className="fix-meta">
                        <span className="fix-category">{fix.category}</span>
                        <span className={`fix-difficulty ${fix.difficulty}`}>
                          {fix.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistantEnhanced;
