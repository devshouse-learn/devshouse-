import dns from 'dns';
import { promisify } from 'util';
import net from 'net';
import logger from '../utils/logger.js';

const resolveMx = promisify(dns.resolveMx);

// ============================================
// SERVICIO DE VALIDACIÓN DE EMAIL
// ============================================

class EmailValidationService {
  constructor() {
    // Dominios de email desechables conocidos
    this.disposableEmailDomains = [
      'tempmail.com',
      'guerrillamail.com',
      '10minutemail.com',
      'mailinator.com',
      'throwaway.email',
      'temp-mail.org',
      'fakeinbox.com',
      'trashmail.com',
      'yopmail.com',
      'sharklasers.com',
      'guerrillamail.info',
      'grr.la',
      'guerrillamail.biz',
      'guerrillamail.de',
      'spam4.me',
      'maildrop.cc',
    ];

    // Lista de dominios confiables
    this.trustedDomains = [
      'gmail.com',
      'googlemail.com',
      'outlook.com',
      'hotmail.com',
      'yahoo.com',
      'icloud.com',
      'protonmail.com',
      'live.com',
      'msn.com',
    ];
  }

  // Validar formato de email
  validateEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Extraer dominio del email
  extractDomain(email) {
    return email.split('@')[1]?.toLowerCase();
  }

  // Verificar si es email desechable
  isDisposableEmail(email) {
    const domain = this.extractDomain(email);
    return this.disposableEmailDomains.includes(domain);
  }

  // Verificar registros MX del dominio
  async verifyMXRecords(domain) {
    try {
      const addresses = await resolveMx(domain);
      
      if (!addresses || addresses.length === 0) {
        return {
          valid: false,
          reason: 'No se encontraron registros MX para este dominio',
        };
      }

      // Ordenar por prioridad (menor número = mayor prioridad)
      addresses.sort((a, b) => a.priority - b.priority);

      logger.info('Registros MX verificados', {
        domain,
        mxRecords: addresses.length,
        primaryMX: addresses[0].exchange,
      });

      return {
        valid: true,
        mxRecords: addresses,
        primaryMX: addresses[0].exchange,
      };
    } catch (error) {
      logger.warn('Error al verificar registros MX', {
        domain,
        error: error.message,
      });

      return {
        valid: false,
        reason: 'Dominio no existe o no tiene servidor de correo configurado',
        error: error.code,
      };
    }
  }

  // Verificar si el servidor SMTP responde (sin enviar email)
  async verifySMTPServer(mxRecord, timeout = 5000) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      let responded = false;

      // Timeout
      const timeoutId = setTimeout(() => {
        if (!responded) {
          responded = true;
          socket.destroy();
          resolve({
            valid: false,
            reason: 'El servidor SMTP no respondió a tiempo',
          });
        }
      }, timeout);

      // Intentar conectar al servidor SMTP
      socket.connect(25, mxRecord, () => {
        if (!responded) {
          responded = true;
          clearTimeout(timeoutId);
          socket.destroy();
          resolve({
            valid: true,
            message: 'Servidor SMTP responde correctamente',
          });
        }
      });

      // Manejar errores
      socket.on('error', (error) => {
        if (!responded) {
          responded = true;
          clearTimeout(timeoutId);
          socket.destroy();
          resolve({
            valid: false,
            reason: 'No se pudo conectar al servidor SMTP',
            error: error.code,
          });
        }
      });

      // Manejar datos recibidos
      socket.on('data', () => {
        if (!responded) {
          responded = true;
          clearTimeout(timeoutId);
          socket.destroy();
          resolve({
            valid: true,
            message: 'Servidor SMTP activo y respondiendo',
          });
        }
      });
    });
  }

  // Verificación completa de email
  async validateEmail(email) {
    const result = {
      email,
      valid: false,
      checks: {
        format: false,
        disposable: false,
        mxRecords: false,
        smtpServer: false,
      },
      details: {},
      errors: [],
    };

    try {
      // 1. Validar formato
      if (!this.validateEmailFormat(email)) {
        result.errors.push('Formato de email inválido');
        result.details.format = 'Email no cumple con el formato estándar';
        return result;
      }
      result.checks.format = true;

      // 2. Verificar si es email desechable
      if (this.isDisposableEmail(email)) {
        result.errors.push('Email desechable no permitido');
        result.details.disposable = 'Este dominio es conocido por proveer emails temporales';
        return result;
      }
      result.checks.disposable = true;

      const domain = this.extractDomain(email);

      // 3. Verificar registros MX
      const mxResult = await this.verifyMXRecords(domain);
      if (!mxResult.valid) {
        result.errors.push(mxResult.reason);
        result.details.mxRecords = mxResult;
        return result;
      }
      result.checks.mxRecords = true;
      result.details.mxRecords = {
        valid: true,
        primaryMX: mxResult.primaryMX,
        totalRecords: mxResult.mxRecords.length,
      };

      // 4. Verificar servidor SMTP (opcional, puede ser lento)
      if (process.env.VERIFY_SMTP_SERVER === 'true') {
        const smtpResult = await this.verifySMTPServer(mxResult.primaryMX);
        if (!smtpResult.valid) {
          result.errors.push(smtpResult.reason);
          result.details.smtpServer = smtpResult;
          // No retornar aquí, ya que el servidor puede estar bloqueando conexiones
        } else {
          result.checks.smtpServer = true;
          result.details.smtpServer = smtpResult;
        }
      }

      // Email es válido si pasó formato, no es desechable y tiene MX
      result.valid = result.checks.format && result.checks.disposable && result.checks.mxRecords;

      // Información adicional
      result.details.trusted = this.trustedDomains.includes(domain);
      result.details.domain = domain;

      logger.info('Email validado', {
        email,
        valid: result.valid,
        checks: result.checks,
      });

      return result;
    } catch (error) {
      logger.error('Error al validar email', error, { email });
      result.errors.push('Error inesperado durante la validación');
      result.details.error = error.message;
      return result;
    }
  }

  // Validar email rápido (solo formato y dominios desechables)
  async quickValidateEmail(email) {
    const result = {
      valid: false,
      reason: null,
    };

    // Validar formato
    if (!this.validateEmailFormat(email)) {
      result.reason = 'Formato de email inválido';
      return result;
    }

    // Verificar si es desechable
    if (this.isDisposableEmail(email)) {
      result.reason = 'Email desechable no permitido';
      return result;
    }

    // Verificar MX solo para dominios no confiables
    const domain = this.extractDomain(email);
    if (!this.trustedDomains.includes(domain)) {
      const mxResult = await this.verifyMXRecords(domain);
      if (!mxResult.valid) {
        result.reason = mxResult.reason;
        return result;
      }
    }

    result.valid = true;
    return result;
  }

  // Verificar múltiples emails en lote
  async validateEmailBatch(emails, quick = true) {
    const results = {
      total: emails.length,
      valid: 0,
      invalid: 0,
      details: [],
    };

    for (const email of emails) {
      const validation = quick
        ? await this.quickValidateEmail(email)
        : await this.validateEmail(email);

      if (validation.valid) {
        results.valid++;
      } else {
        results.invalid++;
      }

      results.details.push({
        email,
        valid: validation.valid,
        reason: validation.reason || validation.errors?.[0],
      });
    }

    return results;
  }

  // Sugerir correcciones comunes
  suggestEmailCorrection(email) {
    const corrections = [];
    const domain = this.extractDomain(email);

    // Correcciones comunes de dominios
    const commonMistakes = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmil.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'gnail.com': 'gmail.com',
      'hotmial.com': 'hotmail.com',
      'hotmai.com': 'hotmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'outlok.com': 'outlook.com',
      'outloo.com': 'outlook.com',
    };

    if (commonMistakes[domain]) {
      const [localPart] = email.split('@');
      corrections.push(`${localPart}@${commonMistakes[domain]}`);
    }

    return corrections;
  }
}

// Exportar instancia singleton
const emailValidationService = new EmailValidationService();

export { emailValidationService, EmailValidationService };
export default emailValidationService;
