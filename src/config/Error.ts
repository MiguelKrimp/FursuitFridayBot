export class TwitterError {
  readonly internalError: any;
  constructor(error: any) {
    this.internalError = error;
  }
}
