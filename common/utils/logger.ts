import { log, DateTime } from '../../dep.ts';

const formatter = (logRecord: any) => {
    let { datetime, levelName, msg } = logRecord;
    return `${DateTime.format(
        datetime,
        'yyyy-MM-dd HH:mm:ss.SSS',
    )} ${levelName} ${msg}`;
};

await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler('DEBUG', {
            formatter,
        }),
        file_debug: new log.handlers.RotatingFileHandler('DEBUG', {
            maxBytes: 10 * 1024 * 1024, //10MB
            maxBackupCount: 50,
            filename: 'logs/log_debug.txt',
            formatter,
        }),
        file_warning: new log.handlers.FileHandler('WARNING', {
            filename: 'logs/log_warning.txt',
            formatter,
        }),
    },
    loggers: {
        default: {
            level: 'DEBUG',
            handlers: ['console', 'file_debug', 'file_warning'],
        },
    },
});

export default log.getLogger();
