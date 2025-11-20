// Validación y manejo de formularios
document.addEventListener('DOMContentLoaded', function() {
    // Formulario de Convenios
    const conveniosForm = document.getElementById('conveniosForm');
    if (conveniosForm) {
        // Contador de caracteres para descripción
        const descripcionConvenio = document.getElementById('descripcionConvenio');
        if (descripcionConvenio) {
            descripcionConvenio.addEventListener('input', updateCharCount);
        }

        conveniosForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateConveniosForm()) {
                submitForm(conveniosForm, 'Convenio');
            }
        });
    }

    // Formulario de Emprendimientos
    const emprendimientosForm = document.getElementById('emprendimientosForm');
    if (emprendimientosForm) {
        // Contador de caracteres para descripción corta
        const descripcionCorta = document.getElementById('descripcionCorta');
        if (descripcionCorta) {
            descripcionCorta.addEventListener('input', function() {
                const counter = document.querySelector('.char-counter');
                if (counter) {
                    counter.textContent = `${this.value.length}/200 caracteres`;
                }
            });
        }

        // Validar al menos un objetivo seleccionado
        emprendimientosForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateEmprendimientosForm()) {
                submitForm(emprendimientosForm, 'Emprendimiento');
            }
        });
    }

    // Formulario de Empleos
    const empleosForm = document.getElementById('empleosForm');
    if (empleosForm) {
        empleosForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateEmpleosForm()) {
                submitForm(empleosForm, 'Empleo');
            }
        });

        // Validar fecha de cierre no sea en el pasado
        const fechaCierre = document.getElementById('fechaCierre');
        if (fechaCierre) {
            const today = new Date().toISOString().split('T')[0];
            fechaCierre.setAttribute('min', today);
        }
    }

    // Formulario de Búsqueda de Empleo
    const buscarEmpleoForm = document.getElementById('buscarEmpleoForm');
    if (buscarEmpleoForm) {
        buscarEmpleoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateBuscarEmpleoForm()) {
                submitForm(buscarEmpleoForm, 'Candidato');
            }
        });

        // Validar fecha de nacimiento (mayor de 16 años)
        const fechaNacimiento = document.getElementById('fechaNacimiento');
        if (fechaNacimiento) {
            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() - 16);
            fechaNacimiento.setAttribute('max', maxDate.toISOString().split('T')[0]);
        }
    }

    // Validación en tiempo real de campos requeridos
    const forms = document.querySelectorAll('.registration-form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
});

// Validar campo individual
function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.style.borderColor = 'var(--danger-color)';
        return false;
    } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            field.style.borderColor = 'var(--danger-color)';
            return false;
        }
    } else if (field.type === 'url' && field.value) {
        try {
            new URL(field.value);
        } catch {
            field.style.borderColor = 'var(--danger-color)';
            return false;
        }
    }
    field.style.borderColor = 'var(--success-color)';
    return true;
}

// Validar formulario de convenios
function validateConveniosForm() {
    const form = document.getElementById('conveniosForm');
    const terminosConvenio = document.getElementById('terminosConvenio');
    const autorizacionDatos = document.getElementById('autorizacionDatos');

    if (!terminosConvenio.checked) {
        showError('Debe aceptar los términos y condiciones del convenio.');
        return false;
    }

    if (!autorizacionDatos.checked) {
        showError('Debe autorizar el tratamiento de datos personales.');
        return false;
    }

    // Validar campos requeridos
    const requiredFields = form.querySelectorAll('[required]');
    for (let field of requiredFields) {
        if (!validateField(field)) {
            showError('Por favor, complete todos los campos requeridos correctamente.');
            field.focus();
            return false;
        }
    }

    return true;
}

// Validar formulario de emprendimientos
function validateEmprendimientosForm() {
    const form = document.getElementById('emprendimientosForm');
    const terminosEmprendimiento = document.getElementById('terminosEmprendimiento');
    const autorizacionDatosEmpresa = document.getElementById('autorizacionDatosEmpresa');

    // Validar checkboxes de términos
    if (!terminosEmprendimiento.checked) {
        showError('Debe aceptar los términos y condiciones de publicación.');
        return false;
    }

    if (!autorizacionDatosEmpresa.checked) {
        showError('Debe autorizar el tratamiento de datos.');
        return false;
    }

    // Validar que al menos un objetivo esté seleccionado
    const objetivos = form.querySelectorAll('input[name="objetivo"]:checked');
    if (objetivos.length === 0) {
        showError('Debe seleccionar al menos un objetivo para la publicación.');
        return false;
    }

    // Validar campos requeridos
    const requiredFields = form.querySelectorAll('[required]');
    for (let field of requiredFields) {
        if (!validateField(field)) {
            showError('Por favor, complete todos los campos requeridos correctamente.');
            field.focus();
            return false;
        }
    }

    return true;
}

// Validar formulario de empleos
function validateEmpleosForm() {
    const form = document.getElementById('empleosForm');
    const terminosEmpleo = document.getElementById('terminosEmpleo');
    const autorizacionDatosEmpleo = document.getElementById('autorizacionDatosEmpleo');

    if (!terminosEmpleo.checked) {
        showError('Debe aceptar los términos y condiciones de publicación.');
        return false;
    }

    if (!autorizacionDatosEmpleo.checked) {
        showError('Debe autorizar el tratamiento de datos.');
        return false;
    }

    // Validar fecha de cierre
    const fechaCierre = document.getElementById('fechaCierre');
    if (fechaCierre.value) {
        const fecha = new Date(fechaCierre.value);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fecha < hoy) {
            showError('La fecha de cierre no puede ser en el pasado.');
            fechaCierre.focus();
            return false;
        }
    }

    // Validar campos requeridos
    const requiredFields = form.querySelectorAll('[required]');
    for (let field of requiredFields) {
        if (!validateField(field)) {
            showError('Por favor, complete todos los campos requeridos correctamente.');
            field.focus();
            return false;
        }
    }

    return true;
}

// Validar formulario de búsqueda de empleo
function validateBuscarEmpleoForm() {
    const form = document.getElementById('buscarEmpleoForm');
    const terminosBusqueda = document.getElementById('terminosBusqueda');
    const autorizacionDatosCandidato = document.getElementById('autorizacionDatosCandidato');

    if (!terminosBusqueda.checked) {
        showError('Debe aceptar los términos y condiciones de uso.');
        return false;
    }

    if (!autorizacionDatosCandidato.checked) {
        showError('Debe autorizar el tratamiento de datos.');
        return false;
    }

    // Validar que al menos un tipo de empleo esté seleccionado
    const tiposEmpleo = form.querySelectorAll('input[name="tipoEmpleo"]:checked');
    if (tiposEmpleo.length === 0) {
        showError('Debe seleccionar al menos un tipo de empleo deseado.');
        return false;
    }

    // Validar que al menos una modalidad esté seleccionada
    const modalidades = form.querySelectorAll('input[name="modalidad"]:checked');
    if (modalidades.length === 0) {
        showError('Debe seleccionar al menos una modalidad preferida.');
        return false;
    }

    // Validar campos requeridos
    const requiredFields = form.querySelectorAll('[required]');
    for (let field of requiredFields) {
        if (!validateField(field)) {
            showError('Por favor, complete todos los campos requeridos correctamente.');
            field.focus();
            return false;
        }
    }

    return true;
}

// Enviar formulario
function submitForm(form, formType) {
    const formData = new FormData(form);
    const data = {};
    
    // Convertir FormData a objeto
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Si la clave ya existe, convertir a array
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }

    // Agregar checkboxes de objetivos (emprendimientos)
    if (formType === 'Emprendimiento') {
        const objetivos = [];
        form.querySelectorAll('input[name="objetivo"]:checked').forEach(checkbox => {
            objetivos.push(checkbox.value);
        });
        data.objetivos = objetivos;
    }

    // Agregar checkboxes de preferencias (candidatos)
    if (formType === 'Candidato') {
        const tiposEmpleo = [];
        form.querySelectorAll('input[name="tipoEmpleo"]:checked').forEach(checkbox => {
            tiposEmpleo.push(checkbox.value);
        });
        data.tiposEmpleo = tiposEmpleo;

        const modalidades = [];
        form.querySelectorAll('input[name="modalidad"]:checked').forEach(checkbox => {
            modalidades.push(checkbox.value);
        });
        data.modalidades = modalidades;
    }

    // Simular envío (aquí se conectaría con un backend)
    console.log(`Datos del formulario de ${formType}:`, data);

    // Deshabilitar botón de envío
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    // Simular respuesta del servidor
    setTimeout(() => {
        showSuccess(`¡${formType} registrado exitosamente! Nos pondremos en contacto pronto.`);
        
        // Limpiar formulario
        form.reset();
        
        // Rehabilitar botón
        submitBtn.disabled = false;
        submitBtn.textContent = formType === 'Convenio' ? 'Enviar Solicitud' : 
                                 formType === 'Emprendimiento' ? 'Publicar Emprendimiento' :
                                 formType === 'Candidato' ? 'Registrar Perfil' :
                                 'Publicar Vacante';
        
        // Resetear estilos de validación
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '';
        });

        // Mostrar modal de comunidad después de 1 segundo
        setTimeout(() => {
            mostrarModalComunidad();
        }, 1000);
    }, 1500);
}

// Mostrar mensaje de error
function showError(message) {
    // Eliminar mensajes anteriores
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
    
    const form = document.querySelector('.registration-form');
    form.insertBefore(errorDiv, form.firstChild);

    // Scroll al mensaje
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Ocultar después de 5 segundos
    setTimeout(() => {
        errorDiv.classList.remove('show');
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

// Mostrar mensaje de éxito
function showSuccess(message) {
    // Eliminar mensajes anteriores
    const existingSuccess = document.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `<strong>¡Éxito!</strong> ${message}`;
    
    const form = document.querySelector('.registration-form');
    form.insertBefore(successDiv, form.firstChild);

    // Scroll al mensaje
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Actualizar contador de caracteres
function updateCharCount(event) {
    const field = event.target;
    const maxLength = field.getAttribute('maxlength');
    
    if (maxLength) {
        const counter = field.parentElement.querySelector('.char-counter');
        if (counter) {
            counter.textContent = `${field.value.length}/${maxLength} caracteres`;
        }
    }
}

// Formatear número de teléfono (opcional)
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    
    if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{0,4})/, '$1 $2 $3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '$1 $2');
    }
    
    input.value = value.trim();
}

// Añadir formateo de teléfono a campos de teléfono
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', function() {
        formatPhoneNumber(this);
    });
});

// Validación de NIT/RUT (Colombia)
function validateNIT(nit) {
    // Eliminar caracteres no numéricos excepto el guión
    nit = nit.replace(/[^0-9-]/g, '');
    
    // Formato básico: debe tener números y opcionalmente un dígito de verificación
    const nitRegex = /^\d{9,10}(-\d)?$/;
    return nitRegex.test(nit);
}

// Añadir validación de NIT a campos correspondientes
document.querySelectorAll('input[id*="nit"], input[id*="Nit"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateNIT(this.value)) {
            this.style.borderColor = 'var(--danger-color)';
            showError('Formato de NIT inválido. Use el formato: 123456789 o 123456789-0');
        }
    });
});

// Funciones para el modal de comunidad
function mostrarModalComunidad() {
    const modal = document.getElementById('comunidadModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModal() {
    const modal = document.getElementById('comunidadModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Redirigir al index después de cerrar el modal
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 300);
    }
}

function unirseWhatsApp(tipo) {
    // URLs de grupos de WhatsApp según el tipo de comunidad
    const whatsappLinks = {
        'convenios': 'https://chat.whatsapp.com/convenios-educativos',
        'emprendimientos': 'https://chat.whatsapp.com/emprendedores',
        'empleos': 'https://chat.whatsapp.com/reclutadores',
        'candidatos': 'https://chat.whatsapp.com/candidatos'
    };
    
    const link = whatsappLinks[tipo] || 'https://wa.me/';
    
    // Mensaje personalizado
    const mensajes = {
        'convenios': 'Hola! Me uno a la comunidad de convenios educativos de DevsHouse',
        'emprendimientos': 'Hola! Me uno a la comunidad de emprendedores de DevsHouse',
        'empleos': 'Hola! Me uno a la comunidad de reclutadores de DevsHouse',
        'candidatos': 'Hola! Me uno a la bolsa de empleo de DevsHouse'
    };
    
    const mensaje = encodeURIComponent(mensajes[tipo] || 'Hola!');
    
    // Abrir en nueva ventana (puedes cambiar el link por el real)
    window.open(`${link}?text=${mensaje}`, '_blank');
}

function unirseDiscord(tipo) {
    // URLs de servidores de Discord según el tipo de comunidad
    const discordLinks = {
        'convenios': 'https://discord.gg/convenios-educativos',
        'emprendimientos': 'https://discord.gg/emprendedores',
        'empleos': 'https://discord.gg/reclutadores',
        'candidatos': 'https://discord.gg/candidatos'
    };
    
    const link = discordLinks[tipo] || 'https://discord.com/';
    
    // Abrir en nueva ventana (puedes cambiar el link por el real)
    window.open(link, '_blank');
}

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    const modal = document.getElementById('comunidadModal');
    if (modal && event.target === modal) {
        cerrarModal();
    }
});

// Funciones del Asistente IA
function toggleAIAssistant() {
    const aiChat = document.getElementById('aiChat');
    aiChat.classList.toggle('hidden');
    
    if (!aiChat.classList.contains('hidden')) {
        document.getElementById('aiInput').focus();
    }
}

function handleQuickQuestion(type) {
    const responses = {
        'plataforma': {
            question: '🔧 Problemas técnicos',
            answer: 'Entiendo que estás teniendo problemas técnicos. Aquí están las soluciones más comunes:\n\n1. **Plataforma caída**: Estamos monitoreando constantemente. Si hay problemas, te notificaremos por email.\n2. **Problemas de carga**: Intenta limpiar caché y cookies de tu navegador.\n3. **Errores al enviar formularios**: Verifica que todos los campos requeridos estén completos.\n4. **Problemas de conexión**: Revisa tu conexión a internet.\n\n¿Necesitas ayuda específica con algo más?'
        },
        'cuenta': {
            question: '👤 Mi cuenta',
            answer: 'Con gusto te ayudo con tu cuenta:\n\n• **Registro**: Completa el formulario según tu perfil (convenio, emprendimiento o empleo)\n• **Acceso a comunidades**: Después de registrarte, recibirás enlaces a WhatsApp y Discord\n• **Actualizar información**: Puedes contactarnos para modificar tus datos\n• **Privacidad**: Tus datos están protegidos según nuestra política de privacidad\n\n¿Qué necesitas hacer con tu cuenta?'
        },
        'registro': {
            question: '📝 Ayuda con registro',
            answer: '¡Te ayudo con el registro! Tenemos 4 opciones:\n\n1. **Convenios con Colegios**: Para instituciones educativas\n2. **Emprendimientos**: Para empresas que quieren publicar su proyecto\n3. **Publicar Empleo**: Para empresas que buscan talento\n4. **Buscar Empleo**: Para candidatos que buscan oportunidades\n\nCada formulario está diseñado específicamente para tu necesidad. ¿Cuál te interesa?'
        },
        'info': {
            question: 'ℹ️ Información general',
            answer: '**DevsHouse** es una plataforma que conecta:\n\n🎓 **Estudiantes e Instituciones**: Formación en tecnologías (VS Code, Git, API REST, IA)\n🚀 **Emprendedores**: Visibilidad, networking e inversión\n💼 **Empresas y Talento**: Reclutamiento eficiente con IA\n\nOfrecemos:\n✓ Capacitación tecnológica\n✓ Comunidades especializadas\n✓ IA para optimizar todos los procesos\n✓ Networking profesional\n\n¿Qué más te gustaría saber?'
        }
    };

    const response = responses[type];
    if (response) {
        addMessage(response.question, 'user');
        setTimeout(() => {
            addMessage(response.answer, 'bot');
        }, 500);
    }
}

function addMessage(text, sender) {
    const messagesContainer = document.getElementById('aiMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ${sender}`;
    
    const messageP = document.createElement('p');
    messageP.textContent = text;
    messageP.style.whiteSpace = 'pre-line';
    
    messageDiv.appendChild(messageP);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll al final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    addMessage(message, 'user');
    input.value = '';
    
    // Simular respuesta de IA
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessage(response, 'bot');
    }, 800);
}

function handleAIEnter(event) {
    if (event.key === 'Enter') {
        sendAIMessage();
    }
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Detección de problemas técnicos
    if (lowerMessage.includes('error') || lowerMessage.includes('problema') || lowerMessage.includes('no funciona') || lowerMessage.includes('caída') || lowerMessage.includes('caido')) {
        return '🔧 Entiendo que tienes un problema técnico. Intenta lo siguiente:\n\n1. Refresca la página (F5)\n2. Limpia caché del navegador\n3. Verifica tu conexión a internet\n4. Si persiste, contáctanos con detalles del error\n\nEstamos aquí para ayudarte 24/7. ¿El problema persiste?';
    }
    
    // Registro
    if (lowerMessage.includes('registr') || lowerMessage.includes('inscrib') || lowerMessage.includes('formulario')) {
        return '📝 Para registrarte:\n\n1. Selecciona tu perfil en la página principal\n2. Completa el formulario con tus datos\n3. Acepta términos y condiciones\n4. ¡Listo! Te unirás a la comunidad\n\n¿Necesitas ayuda con algún campo específico?';
    }
    
    // Convenios
    if (lowerMessage.includes('convenio') || lowerMessage.includes('colegio') || lowerMessage.includes('educati')) {
        return '🏫 Los convenios educativos incluyen:\n\n✓ Capacitación en VS Code, Git, API REST e IA\n✓ Prácticas profesionales\n✓ Acceso a comunidad educativa\n✓ Eventos y talleres\n\n¿Tu institución está interesada?';
    }
    
    // Emprendimientos
    if (lowerMessage.includes('emprendimiento') || lowerMessage.includes('empresa') || lowerMessage.includes('negocio')) {
        return '🚀 Para emprendedores ofrecemos:\n\n✓ Visibilidad empresarial\n✓ Networking con inversores\n✓ Comunidad de emprendedores\n✓ IA para optimizar procesos\n\n¿Quieres publicar tu emprendimiento?';
    }
    
    // Empleo
    if (lowerMessage.includes('empleo') || lowerMessage.includes('trabajo') || lowerMessage.includes('vacante')) {
        return '💼 Tenemos dos opciones:\n\n**Para Empresas**: Publica vacantes y encuentra talento\n**Para Candidatos**: Registra tu perfil y encuentra oportunidades\n\nAmbas con IA para mejor matching. ¿Cuál te interesa?';
    }
    
    // IA
    if (lowerMessage.includes('ia') || lowerMessage.includes('inteligencia artificial')) {
        return '🤖 Nuestra IA te ayuda a:\n\n✓ Optimizar búsquedas de empleo\n✓ Matching entre candidatos y empresas\n✓ Mejorar proyectos de emprendimiento\n✓ Asistir en proyectos educativos\n✓ Resolver dudas 24/7\n\n¡Está disponible en todas nuestras opciones!';
    }
    
    // Respuesta por defecto
    return '¡Gracias por tu mensaje! Puedo ayudarte con:\n\n🔧 Problemas técnicos\n👤 Información de cuenta\n📝 Proceso de registro\nℹ️ Información general\n\nPor favor, selecciona una opción arriba o escríbeme con más detalles. ¿En qué más puedo asistirte?';
}
