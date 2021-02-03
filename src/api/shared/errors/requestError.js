// eslint-disable-next-line max-classes-per-file
const { UserFacingError } = require('./baseError')

class BadRequestError extends UserFacingError {
    constructor(message) {
        super(message);
        this.code = 400;
    }

    get statusCode() {
        return this.code;
    }
}


class NotFoundError extends UserFacingError {
    constructor(message) {
        super(message);
        this.code = 404;
    }

    get statusCode() {
        return this.code;
    }
}

class ConflictError extends UserFacingError {
    constructor(message) {
        super(message);
        this.code = 409;
    }

    get statusCode() {
        return this.code;
    }
}

module.exports = {
    BadRequestError,
    NotFoundError,
    ConflictError
}