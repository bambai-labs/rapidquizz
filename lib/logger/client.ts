import pino from 'pino'

const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label }
    },
  },
  browser: {
    asObject: true,
  },
  level: isDevelopment ? 'debug' : 'warn',
})
