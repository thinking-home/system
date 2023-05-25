import {JsonValue, Logger, LogLevel} from '@thinking-home/ui';

export interface LogItem {
    level: LogLevel;
    context: Record<string, JsonValue>;
    message: string;
    timestamp: number;
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

    write({level, message, context, timestamp}: LogItem): void {
        if (level >= this.minLevel) {
            const log = level >= LogLevel.Warning ? console.error : console.info;
            
            const ts = new Date(timestamp).toUTCString();
            const ns = String(context[NS_FIELD]).toUpperCase();
            const lvl = LEVEL_NAMES[level];

            const prefix = `${ts} ${lvl} ${ns}:`;

            log(prefix, message);
        }
    }
}

export class AppLogger implements Logger {
    constructor(
        private destinations: LogDestination[],
        private context: Record<string, JsonValue> = {},
        private getTimestemp: () => number,
    ) {
    }

    child(context: Record<string, JsonValue>): Logger {
        return new AppLogger(this.destinations, {...this.context, ...context}, this.getTimestemp);
    }

    log(level: LogLevel, message: string): void {
        const item: LogItem = {level, message, timestamp: this.getTimestemp(), context: this.context};

        this.destinations.forEach(d => d.write(item));
    }
}
