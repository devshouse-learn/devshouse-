import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// ============================================
// SERVICIO DE EMAIL
// ============================================

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
    this.initializeTransporter();
  }

  // Inicializar transportador de email
  initializeTransporter() {
    try {
      // Configuración para diferentes proveedores
      const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';

      if (emailProvider === 'gmail') {
        this.transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD, // Contraseña de aplicación de Gmail
          },
        });
      } else if (emailProvider === 'smtp') {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      } else {
        // Configuración de prueba (Ethereal Email)
        logger.warn('Usando configuración de email de prueba');
        this.createTestAccount();
        return;
      }

      this.initialized = true;
      logger.info('Servicio de email inicializado correctamente');
    } catch (error) {
      logger.error('Error al inicializar servicio de email', error);
      this.initialized = false;
    }
  }

  // Crear cuenta de prueba (Ethereal)
  async createTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      this.initialized = true;
      logger.info('Cuenta de email de prueba creada', {
        user: testAccount.user,
        webmail: 'https://ethereal.email/messages',
      });
    } catch (error) {
      logger.error('Error al crear cuenta de prueba', error);
    }
  }

  // Verificar configuración
  async verifyConnection() {
    try {
      if (!this.transporter) {
        throw new Error('Transportador no inicializado');
      }

      await this.transporter.verify();
      logger.info('Conexión de email verificada');
      return true;
    } catch (error) {
      logger.error('Error al verificar conexión de email', error);
      return false;
    }
  }

  // Enviar email genérico
  async sendEmail({ to, subject, html, text }) {
    try {
      if (!this.initialized) {
        throw new Error('Servicio de email no inicializado');
      }

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'DevsHouse'}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        text,
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info('Email enviado exitosamente', {
        to,
        subject,
        messageId: info.messageId,
      });

      // Si es cuenta de prueba, mostrar URL
      if (process.env.NODE_ENV === 'development') {
        const previewURL = nodemailer.getTestMessageUrl(info);
        if (previewURL) {
          logger.info('Preview URL:', previewURL);
        }
      }

      return {
        success: true,
        messageId: info.messageId,
        previewURL: nodemailer.getTestMessageUrl(info),
      };
    } catch (error) {
      logger.error('Error al enviar email', error, { to, subject });
      throw error;
    }
  }

  // Enviar email de verificación
  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #667eea;
            margin: 0;
          }
          .content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .button:hover {
            opacity: 0.9;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
          }
          .code {
            background: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            text-align: center;
            font-size: 18px;
            letter-spacing: 2px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 DevsHouse</h1>
          </div>
          
          <div class="content">
            <h2>¡Bienvenido/a, ${user.name}!</h2>
            
            <p>Gracias por registrarte en DevsHouse. Para completar tu registro, por favor verifica tu dirección de correo electrónico.</p>
            
            <p>Haz clic en el siguiente botón para verificar tu cuenta:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verificar mi cuenta</a>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <div class="code">${verificationUrl}</div>
            
            <p><strong>Este enlace expirará en 24 horas.</strong></p>
            
            <p>Si no has creado una cuenta en DevsHouse, puedes ignorar este mensaje.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} DevsHouse - Plataforma Educativa y Laboral</p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      ¡Bienvenido/a a DevsHouse, ${user.name}!
      
      Para completar tu registro, verifica tu correo electrónico haciendo clic en el siguiente enlace:
      ${verificationUrl}
      
      Este enlace expirará en 24 horas.
      
      Si no has creado una cuenta en DevsHouse, ignora este mensaje.
      
      © ${new Date().getFullYear()} DevsHouse
    `;

    return await this.sendEmail({
      to: user.email,
      subject: '✅ Verifica tu cuenta de DevsHouse',
      html,
      text,
    });
  }

  // Enviar email de bienvenida
  async sendWelcomeEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #667eea;
            margin: 0;
          }
          .content {
            background: white;
            padding: 20px;
            border-radius: 8px;
          }
          .feature {
            padding: 15px;
            margin: 10px 0;
            background: #f0f4ff;
            border-left: 4px solid #667eea;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ¡Bienvenido/a a DevsHouse!</h1>
          </div>
          
          <div class="content">
            <h2>Hola ${user.name},</h2>
            
            <p>¡Tu cuenta ha sido verificada exitosamente! Ahora tienes acceso completo a todas nuestras funcionalidades.</p>
            
            <h3>¿Qué puedes hacer en DevsHouse?</h3>
            
            <div class="feature">
              <strong>📚 Convenios Educativos</strong>
              <p>Conecta con instituciones educativas y accede a programas de formación.</p>
            </div>
            
            <div class="feature">
              <strong>💡 Emprendimientos</strong>
              <p>Comparte tus proyectos y encuentra colaboradores.</p>
            </div>
            
            <div class="feature">
              <strong>💼 Empleos</strong>
              <p>Descubre oportunidades laborales que se ajusten a tu perfil.</p>
            </div>
            
            <div class="feature">
              <strong>🤖 Búsqueda Inteligente</strong>
              <p>Encuentra el trabajo perfecto con ayuda de nuestra IA.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL}" class="button">Comenzar Ahora</a>
            </div>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            
            <p>¡Éxitos en tu camino profesional!</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} DevsHouse - Plataforma Educativa y Laboral</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      ¡Bienvenido/a a DevsHouse, ${user.name}!
      
      Tu cuenta ha sido verificada exitosamente.
      
      Ahora puedes:
      - Acceder a convenios educativos
      - Publicar emprendimientos
      - Buscar empleos
      - Usar nuestra IA de búsqueda
      
      Visita: ${process.env.FRONTEND_URL}
      
      © ${new Date().getFullYear()} DevsHouse
    `;

    return await this.sendEmail({
      to: user.email,
      subject: '🎉 ¡Bienvenido/a a DevsHouse!',
      html,
      text,
    });
  }

  // Enviar email de reseteo de contraseña
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background: #f9f9f9; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #667eea; margin: 0; }
          .content { background: white; padding: 20px; border-radius: 8px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reseteo de Contraseña</h1>
          </div>
          
          <div class="content">
            <h2>Hola ${user.name},</h2>
            
            <p>Hemos recibido una solicitud para resetear tu contraseña.</p>
            
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Resetear Contraseña</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este enlace expirará en 1 hora</li>
                <li>Solo puedes usarlo una vez</li>
                <li>Si no solicitaste este cambio, ignora este email</li>
              </ul>
            </div>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} DevsHouse</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Reseteo de Contraseña - DevsHouse
      
      Hola ${user.name},
      
      Haz clic en este enlace para resetear tu contraseña:
      ${resetUrl}
      
      Este enlace expirará en 1 hora.
      
      Si no solicitaste este cambio, ignora este mensaje.
      
      © ${new Date().getFullYear()} DevsHouse
    `;

    return await this.sendEmail({
      to: user.email,
      subject: '🔐 Reseteo de Contraseña - DevsHouse',
      html,
      text,
    });
  }

  // Enviar notificación de cambio de contraseña
  async sendPasswordChangedEmail(user) {
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .container { background: #f9f9f9; border-radius: 10px; padding: 30px; }
          .success { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; border-radius: 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 style="color: #667eea;">🔒 Contraseña Actualizada</h1>
          
          <div class="success">
            <p><strong>Tu contraseña ha sido cambiada exitosamente.</strong></p>
          </div>
          
          <p>Hola ${user.name},</p>
          
          <p>Te confirmamos que la contraseña de tu cuenta ha sido actualizada el ${new Date().toLocaleString('es-ES')}.</p>
          
          <p>Si no realizaste este cambio, por favor contacta a nuestro equipo de soporte inmediatamente.</p>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} DevsHouse</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to: user.email,
      subject: '🔒 Tu contraseña ha sido actualizada',
      html,
      text: `Tu contraseña de DevsHouse ha sido actualizada el ${new Date().toLocaleString('es-ES')}. Si no fuiste tú, contacta a soporte.`,
    });
  }
}

// Exportar instancia singleton
const emailService = new EmailService();

export { emailService, EmailService };
export default emailService;
