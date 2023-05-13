import {JsonValue, Logger, LogLevel} from '@thinking-home/ui';

export interface LogItem {
    level: LogLevel;
    context: Record<string, JsonValue>;
    message: string;
}

export interface LogDestination {
    write(item: LogItem): void;
}

export const NS_FIELD = 'namespace';

export const LEVEL_NAMES = {
    [LogLevel.Debug]: 'DEBUG',
    [LogLevel.Trace]: 'TRACE',
    [LogLevel.Information]: 'INFO',
    [LogLevel.Warning]: 'WARN',
    [LogLevel.Error]: 'ERROR',
    [LogLevel.Fatal]: 'FATAL',
};

export class ConsoleLogDestination implements LogDestination {
    constructor(private minLevel: LogLevel) {
    }

    write({level, message, context}: LogItem): void {
        if (level >= this.minLevel) {
            const log = level >= LogLevel.Warning ? console.error : console.info;

            const prefix = `[${LEVEL_NAMES[level]}] ${context[NS_FIELD]}:`.toUpperCase();

            log(prefix, message);
        }
    }
}

export class AppLogger implements Logger {
    constructor(private destinations: LogDestination[], private context: Record<string, JsonValue> = {}) {
    }

    child(context: Record<string, JsonValue>): Logger {
        return new AppLogger(this.destinations, {...this.context, ...context});
    }

    log(level: LogLevel, message: string): void {
        const item: LogItem = {level, message, context: this.context};

        this.destinations.forEach(d => d.write(item));
    }
}
