const { createLogger, format, transports } = require('winston');

const { combine, label, prettyPrint } = format;

const logger = createLogger({
    format: combine(
        label({ label: `${process.env.CLIENT}-${process.env.ENVIRONMENT}` }),
        prettyPrint()
    ),
    transports: [new transports.Console()]
})

module.exports = { logger };