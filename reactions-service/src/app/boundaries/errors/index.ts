import {
  DomainBusinessRuleViolation,
  DomainInvariantViolation,
} from '@/domain/common/error';

export enum ErrorCode {
  Internal = 'internal',
  NotFound = 'not_found',
  Forbidden = 'forbidden',
  Conflict = 'conflict',
  Validation = 'validation',
  Unprocessable = 'unprocessable',
}

export class ApplicationException extends Error {
  static parse(err: unknown): ApplicationException {
    if (err instanceof ApplicationException) {
      return err;
    }

    if (err instanceof DomainInvariantViolation) {
      return new ApplicationException(
        'Provided data violates domain invariants',
        ErrorCode.Validation,
        err.violations,
      );
    }

    if (err instanceof DomainBusinessRuleViolation) {
      return new ApplicationException(err.message, ErrorCode.Unprocessable);
    }

    if (err instanceof Error) {
      return new InternalException('Critical error occurred', err);
    }

    return new InternalException(
      'Critical error occurred',
      new Error(`Unkown error: ${err as any}`),
    );
  }

  constructor(
    message: string,
    public readonly code: ErrorCode,
    public readonly details: Record<string, string> = {},
  ) {
    super(message);
  }

  public toJSON() {
    return {
      message: this.message,
      code: this.code,
      details: this.details,
    };
  }

  public isCritical(): this is InternalException {
    return this instanceof InternalException;
  }
}

export class NotFoundException extends ApplicationException {
  constructor(message: string) {
    super(message, ErrorCode.NotFound);
  }
}

export class ForbiddenException extends ApplicationException {
  constructor(message: string) {
    super(message, ErrorCode.Forbidden);
  }
}

export class ConflictException extends ApplicationException {
  constructor(message: string) {
    super(message, ErrorCode.Conflict);
  }
}

export class ValidationException extends ApplicationException {
  constructor(message: string) {
    super(message, ErrorCode.Validation);
  }
}

export class InternalException extends ApplicationException {
  constructor(
    message: string,
    private readonly _parent: Error,
  ) {
    super(message, ErrorCode.Internal);
  }

  public get parent(): Error {
    return this._parent;
  }
}
