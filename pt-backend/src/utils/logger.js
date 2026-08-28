const formatMessage = (level, message, ...meta) => {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    meta: meta.length > 1 ? meta : meta[0],
  };
};

const logger = {
  info: (message, ...meta) => {
    console.info("[INFO]", formatMessage("info", message, ...meta));
  },
  warn: (message, ...meta) => {
    console.warn("[WARN]", formatMessage("warn", message, ...meta));
  },
  error: (message, ...meta) => {
    console.error("[ERROR]", formatMessage("error", message, ...meta));
  },
  debug: (message, ...meta) => {
    console.debug("[DEBUG]", formatMessage("debug", message, ...meta));
  },
};

export default logger;