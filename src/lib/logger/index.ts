import pino, { Logger } from 'pino'

export function getLogger(name: string): Logger {
  return pino({ name, level: process.env.LOG_LEVEL || 'info' })
}
