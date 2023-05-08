import {Logger, LoggerArgument, LogLevel} from '@thinking-home/ui';
import {Logger as RoarrLogger, LogLevelName, logLevels, MessageContext, Roarr, ROARR} from 'roarr';
import {createLogWriter} from '@roarr/browser-log-writer';

export function initLogger(minLevel: LogLevelName = 'error') {
    ROARR.write = createLogWriter();

    const level = logLevels[minLevel];
    localStorage.setItem('ROARR_FILTER', `context.logLevel:>${level}`)
    localStorage.setItem('ROARR_LOG', 'true');
}

export class AppLogger extends Logger {
    constructor(private logger: RoarrLogger = Roarr) {
        super();
    }

    public log<T extends string = string>(
        level: LogLevel,
        template: T,
        a?: T extends `${string}%${string}` ? LoggerArgument : never,
        b?: LoggerArgument,
        c?: LoggerArgument,
        d?: LoggerArgument,
        e?: LoggerArgument,
        f?: LoggerArgument
    ): void {
        switch (level) {
            case LogLevel.Trace:
                this.logger.trace<T>(template, a, b, c, d, e, f);
                break;
            case LogLevel.Debug:
                this.logger.debug<T>(template, a, b, c, d, e, f);
                break;
            case LogLevel.Information:
                this.logger.info<T>(template, a, b, c, d, e, f);
                break;
            case LogLevel.Warning:
                this.logger.warn<T>(template, a, b, c, d, e, f);
                break;
            case LogLevel.Error:
                this.logger.error<T>(template, a, b, c, d, e, f);
                break;
            case LogLevel.Fatal:
                this.logger.fatal<T>(template, a, b, c, d, e, f);
                break;
        }
    }

    child<T extends MessageContext>(context?: T): AppLogger {
        const inner = this.logger.child(context);

        return new AppLogger(inner);
    }
}
