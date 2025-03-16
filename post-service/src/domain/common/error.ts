export class DomainInvariantViolation extends Error {
  constructor(
    message: string,
    public readonly violations: Record<string, string> = {},
  ) {
    super(message);
  }
}

export class DomainBusinessRuleViolation extends Error {
  constructor(message: string) {
    super(message);
  }
}
