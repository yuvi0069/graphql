"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiError = exports.ApiWarning = exports.ApiError = void 0;
// eslint-disable-next-line max-classes-per-file
const uuid_1 = require("uuid");
const errors_1 = require("../common/errors");
Object.defineProperty(exports, "MultiError", { enumerable: true, get: function () { return errors_1.MultiError; } });
/**
 * An error with fields for a JSON API error
 * @link https://jsonapi.org/format/#errors
 */
class ApiError extends Error {
    error;
    name = 'ApiError';
    id = (0, uuid_1.v4)();
    /**
     * Create a new ApiError
     * @param error JSON API error definition
     */
    constructor(error) {
        super(error.detail);
        this.error = error;
    }
}
exports.ApiError = ApiError;
/**
 * A warning level error with fields for a JSON API error
 * @link https://jsonapi.org/format/#errors
 *
 * This is used to communicate errors to end users. But it is a warning for the system as it is not something we expect to need to support them with.
 */
class ApiWarning extends Error {
    error;
    name = 'ApiWarning';
    id = (0, uuid_1.v4)();
    /**
     * Create a new ApiWarning
     * @param error JSON API warning definition
     */
    constructor(error) {
        super(error.detail);
        this.error = error;
    }
}
exports.ApiWarning = ApiWarning;
//# sourceMappingURL=api.js.map