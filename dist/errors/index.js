"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IllegalAccessError = exports.IllegalArgumentError = exports.BadParametersError = exports.NoParametersError = exports.PasswordError = exports.NotFoundInDBError = exports.ExternalAPIError = exports.HttpStatusError = void 0;
class HttpStatusError extends Error {
    name = "HttpStatusError";
    httpStatusCode = undefined;
    constructor(message, errorCode) {
        super(message);
        this.httpStatusCode = errorCode;
        this.message = message;
    }
}
exports.HttpStatusError = HttpStatusError;
class ExternalAPIError extends HttpStatusError {
    providerCode;
    constructor(message, errorCode, providerCode) {
        super(message, errorCode);
        this.providerCode = providerCode;
    }
}
exports.ExternalAPIError = ExternalAPIError;
class NotFoundInDBError extends Error {
    name = "NotFoundInDBError";
}
exports.NotFoundInDBError = NotFoundInDBError;
class PasswordError extends Error {
    name = "PasswordError";
}
exports.PasswordError = PasswordError;
class NoParametersError extends Error {
    name = "NoParametersError";
}
exports.NoParametersError = NoParametersError;
class BadParametersError extends Error {
    name = "BadParameterError";
}
exports.BadParametersError = BadParametersError;
class IllegalArgumentError extends Error {
    name = "IllegalArgumentError";
}
exports.IllegalArgumentError = IllegalArgumentError;
class IllegalAccessError extends Error {
    name = "IllegalAccessError";
}
exports.IllegalAccessError = IllegalAccessError;
//# sourceMappingURL=index.js.map