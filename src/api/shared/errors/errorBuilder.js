const { validationResult } = require('express-validator');
const { BadRequestError } = require('./requestError');

async function getErrosFromRequestValidation(req) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return new BadRequestError(result.errors.map(x => x.msg).join(". "));
    }
    return false;
}

module.exports = { getErrosFromRequestValidation }