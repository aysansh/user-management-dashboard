export class NotFoundError extends Error {
    constructor(message = "کاربر پیدا نشد") {
      super(message)
      this.name = "NotFoundError"
    }
  }