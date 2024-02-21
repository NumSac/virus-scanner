export default class ExpressError extends Error {
  private statusCode;
  constructor(message: string, statusCode: unknown) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
