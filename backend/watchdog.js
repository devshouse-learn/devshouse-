import { spawn } from 'child_process';
import http from 'http';

const PORT = process.env.PORT || 3001;
const HEALTH_CHECK_URL = `http://localhost:${PORT}/api/health`;
const HEALTH_CHECK_INTERVAL = 5000; // 5 segundos
const MAX_RETRIES = 3;

let backendProcess = null;
let isRestarting = false;

const startBackend = () => {
  console.log('🚀 Iniciando backend...');
  
  backendProcess = spawn('npm', ['start'], {
    cwd: '/Users/ibacrea/Documents/devshouse-/backend',
    stdio: 'inherit',
  });

  backendProcess.on('error', (err) => {
    console.error('❌ Error al iniciar backend:', err);
  });

  backendProcess.on('exit', (code) => {
    console.warn(`⚠️  Backend salió con código ${code}`);
    if (!isRestarting) {
      console.log('🔄 Reiniciando backend en 3 segundos...');
      setTimeout(() => {
        isRestarting = false;
        startBackend();
      }, 3000);
    }
  });
};

const checkBackendHealth = async (retryCount = 0) => {
  return new Promise((resolve) => {
    const request = http.get(HEALTH_CHECK_URL, { timeout: 3000 }, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Backend saludable');
        resolve(true);
      } else {
        console.warn(`⚠️  Backend respondió con status ${res.statusCode}`);
        resolve(false);
      }
    });

    request.on('error', (error) => {
      if (retryCount < MAX_RETRIES) {
        console.warn(`⚠️  Health check falló (intento ${retryCount + 1}/${MAX_RETRIES}):`, error.message);
      } else {
        console.error(`❌ Backend no disponible después de ${MAX_RETRIES} intentos`);
      }
      resolve(false);
    });

    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
  });
};

const restartBackend = () => {
  if (isRestarting) {
    console.log('⏳ Reinicio ya en progreso...');
    return;
  }

  isRestarting = true;
  console.log('🔄 Reiniciando backend...');

  if (backendProcess) {
    backendProcess.kill('SIGTERM');
    setTimeout(() => {
      if (backendProcess && !backendProcess.killed) {
        backendProcess.kill('SIGKILL');
      }
      startBackend();
    }, 2000);
  } else {
    startBackend();
  }
};

const startHealthMonitor = () => {
  console.log('🏥 Iniciando monitor de salud del backend...');
  
  setInterval(async () => {
    const isHealthy = await checkBackendHealth();
    if (!isHealthy && !isRestarting) {
      restartBackend();
    }
  }, HEALTH_CHECK_INTERVAL);
};

// Iniciar backend y monitor
console.log(`
╔════════════════════════════════════════════════════════════╗
║  🛡️  BACKEND WATCHDOG - PROTECTION & AUTO-RESTART         ║
╚════════════════════════════════════════════════════════════╝

⚙️  Configuración:
  - Health Check URL: ${HEALTH_CHECK_URL}
  - Intervalo de chequeo: ${HEALTH_CHECK_INTERVAL}ms
  - Puerto: ${PORT}

`);

startBackend();
startHealthMonitor();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo watchdog...');
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('🛑 Watchdog terminado');
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
  process.exit(0);
});
