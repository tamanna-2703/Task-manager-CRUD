import pino from 'pino';

// Check if running in Bun (Bun doesn't support pino transport with worker threads)
const isBun = typeof Bun !== 'undefined';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
};

// Level colors mapping
const levelColors: Record<number, string> = {
  10: colors.gray,    // trace
  20: colors.cyan,    // debug
  30: colors.blue,    // info
  40: colors.yellow,  // warn
  50: colors.red,     // error
  60: colors.magenta, // fatal
};

// Custom timestamp formatter for dd-mm-yyyy HH:MM:SS format
const formatTimestamp = (): string => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Custom destination stream for Bun that colorizes output
class ColorizedDestination {
  write(log: string) {
    try {
      const logObj = JSON.parse(log);
      const level = logObj.level || 30;
      const color = levelColors[level] || colors.white;
      const levelName = logObj.level === 10 ? 'TRACE' :
        logObj.level === 20 ? 'DEBUG' :
          logObj.level === 30 ? 'INFO' :
            logObj.level === 40 ? 'WARN' :
              logObj.level === 50 ? 'ERROR' :
                logObj.level === 60 ? 'FATAL' : 'INFO';

      // Build colored output
      let output = `${colors.dim}${logObj.time || formatTimestamp()}${colors.reset} `;
      output += `${color}${levelName.padEnd(5)}${colors.reset} `;

      // Add message
      if (logObj.msg) {
        output += `${colors.bright}${logObj.msg}${colors.reset}`;
      }

      // Add other fields (excluding level, time, msg, pid)
      const otherFields: string[] = [];
      for (const [key, value] of Object.entries(logObj)) {
        if (!['level', 'time', 'msg', 'pid'].includes(key)) {
          otherFields.push(`${colors.gray}${key}${colors.reset}=${colors.cyan}${JSON.stringify(value)}${colors.reset}`);
        }
      }

      if (otherFields.length > 0) {
        output += ` ${otherFields.join(' ')}`;
      }

      console.log(output);
    } catch (e) {
      // Fallback to plain output if parsing fails
      console.log(log);
    }
  }
}

const logger = isBun
  ? pino(
    {
      level: process.env.LOG_LEVEL || 'info',
      timestamp: () => `,"time":"${formatTimestamp()}"`,
      base: {
        pid: false,
      },
    },
    new ColorizedDestination()
  )
  : pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'dd-mm-yyyy HH:MM:ss',
      },
    },
    base: {
      pid: false,
    },
  });

export default logger;
