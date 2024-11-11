"use strict";
/* eslint-disable max-classes-per-file */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalStateError = exports.MultiError = exports.NotYetImplementedError = exports.BaseError = void 0;
class BaseError extends Error {
    name = "BaseError";
    error;
    constructor(detail, error = {}) {
        super(detail);
        this.error = { detail, ...error };
    }
}
exports.BaseError = BaseError;
class NotYetImplementedError extends BaseError {
    name = "NotYetImplementedError";
}
exports.NotYetImplementedError = NotYetImplementedError;
/**
 * Container for multiple child errors
 */
class MultiError extends Error {
    name = "MultiError";
    errors;
    /**
     * Create a new MultiError
     * @param errors List of child errors
     */
    constructor(errors) {
        super();
        // Flatten errors if one of them is a MultiError
        this.errors = [].concat(...errors.map((error) => error instanceof MultiError ? error.errors : error));
    }
}
exports.MultiError = MultiError;
class IllegalStateError extends BaseError {
    name = "IllegalStateError";
}
exports.IllegalStateError = IllegalStateError;
//# sourceMappingURL=errors.js.map