import logger from "../../utils/logger.js";

/**
 * Simple logger utility
 */
const log = (level, message, data = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        level,
        message,
        module: "LeetCode",
        ...data,
    };

    switch (level) {
        case "info":
            logger.info ? logger.info(message, data) : console.log(logEntry);
            break;
        case "error":
            logger.error ? logger.error(message, data) : console.error(logEntry);
            break;
        case "warn":
            logger.warn ? logger.warn(message, data) : console.warn(logEntry);
            break;
        case "debug":
            logger.debug ? logger.debug(message, data) : console.debug(logEntry);
            break;
        default:
            console.log(logEntry);
    }
};

export default { log, info: (msg, data) => log("info", msg, data), error: (msg, data) => log("error", msg, data), warn: (msg, data) => log("warn", msg, data), debug: (msg, data) => log("debug", msg, data), };
