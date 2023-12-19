export class InvalidInputError extends Error {
  constructor(message) {
    super(`Invalid input: ${message}`);
    this.name = this.constructor.name;
  }
}

export class OperationFailedError extends Error {
  constructor(message) {
    super(`Operation failed: ${message}`);
    this.name = this.constructor.name;
  }
}
