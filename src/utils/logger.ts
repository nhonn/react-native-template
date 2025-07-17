// biome-ignore-all lint/suspicious/noConsole: console for development

export interface LoggerConfig {
  enabled: boolean;
  minLevel: "debug" | "info" | "warn" | "error";
  prefix?: string;
}

class Logger {
  private config: LoggerConfig = {
    enabled: __DEV__,
    minLevel: "debug",
    prefix: "",
  };

  constructor(config?: Partial<LoggerConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  private shouldLog(level: "debug" | "info" | "warn" | "error"): boolean {
    return this.config.enabled && level >= this.config.minLevel;
  }

  private formatMessage(level: string, message: string, ...args: unknown[]): [string, ...unknown[]] {
    const timestamp = new Date().toISOString();
    const prefix = this.config.prefix ? `[${this.config.prefix}] ` : "";
    return [`${prefix}[${timestamp}] ${level}: ${message}`, ...args];
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog("debug")) {
      console.log(...this.formatMessage("DEBUG", message, ...args));
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog("info")) {
      console.info(...this.formatMessage("INFO", message, ...args));
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog("warn")) {
      console.warn(...this.formatMessage("WARN", message, ...args));
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog("error")) {
      console.error(...this.formatMessage("ERROR", message, ...args));
    }
  }

  // Simple log method that behaves like console.log but respects dev mode
  log(message: string, ...args: unknown[]): void {
    if (this.config.enabled) {
      console.log(message, ...args);
    }
  }

  // Group logging for related operations
  group(label: string): void {
    if (this.config.enabled) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.config.enabled) {
      console.groupEnd();
    }
  }

  // Table logging for structured data
  table(data: unknown): void {
    if (this.config.enabled) {
      console.table(data);
    }
  }

  // Performance timing
  time(label: string): void {
    if (this.config.enabled) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.config.enabled) {
      console.timeEnd(label);
    }
  }

  // Update configuration
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Create a scoped logger with a specific prefix
  scope(prefix: string): Logger {
    return new Logger({
      ...this.config,
      prefix: this.config.prefix ? `${this.config.prefix}:${prefix}` : prefix,
    });
  }
}

// Default logger instance
export const logger = new Logger();

// Pre-configured loggers for common use cases
export const dbLogger = logger.scope("DB");
export const apiLogger = logger.scope("API");
export const uiLogger = logger.scope("UI");
export const storageLogger = logger.scope("Storage");
export const analyticsLogger = logger.scope("Analytics");

// Simple functions that mirror console methods but respect dev mode
export const log = logger.log.bind(logger);
export const debug = logger.debug.bind(logger);
export const info = logger.info.bind(logger);
export const warn = logger.warn.bind(logger);
export const error = logger.error.bind(logger);
