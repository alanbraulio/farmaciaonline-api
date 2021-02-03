class ApplicationError extends Error {
    get name() {
        return this.constructor.name;
    }
}

class UserFacingError extends ApplicationError { }

module.exports = {
    ApplicationError,
    UserFacingError
}