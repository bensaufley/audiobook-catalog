import { pino } from 'pino';
import type { LokiOptions } from 'pino-loki';
import type { PrettyOptions } from 'pino-pretty';

const logLevels = ['trace', 'debug', 'info', 'warn', 'error'];
const sanitizeLogLevel = (level?: string) => {
  const standardized = level?.trim()?.toLocaleLowerCase();

  if (!standardized) return 'info';

  return logLevels.includes(standardized) ? standardized : 'info';
};
const logLevel = sanitizeLogLevel(process.env.LOG_LEVEL);

const prettyTransport: pino.TransportTargetOptions<PrettyOptions> = {
  target: 'pino-pretty',
  level: logLevel,
  options: {
    colorize: true,
    colorizeObjects: true,
    hideObject: false,
  },
};

const lokiTransport: pino.TransportTargetOptions<LokiOptions> = {
  target: 'pino-loki',
  level: logLevel,
  options: {
    batching: true,
    interval: 5,

    labels: Object.fromEntries(process.env.LOKI_LABELS?.split(',').map((v) => v.split(':')) ?? []),
    host: process.env.LOKI_HOST ?? '',
    ...(process.env.LOKI_USER &&
      process.env.LOKI_PASSWORD && {
        basicAuth: {
          username: process.env.LOKI_USER,
          password: process.env.LOKI_PASSWORD,
        },
      }),
  },
};

const baseTransport: pino.TransportTargetOptions = {
  target: 'pino/file',
  level: logLevel,
  options: { destination: 1 }, // writes to stdout
};

// eslint-disable-next-line import/prefer-default-export
export const pinoTargets = [
  import.meta.env.DEV ? prettyTransport : baseTransport,
  process.env.LOKI_HOST && lokiTransport,
].filter((x) => !!x);

export const bareLogger = pino({
  transport: {
    targets: pinoTargets,
  },
});
