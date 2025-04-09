export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class AndSpecification<T> implements Specification<T> {
  constructor(
    private spec1: Specification<T>,
    private spec2: Specification<T>,
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return (
      this.spec1.isSatisfiedBy(candidate) && this.spec2.isSatisfiedBy(candidate)
    );
  }
}

export class OrSpecification<T> implements Specification<T> {
  constructor(
    private spec1: Specification<T>,
    private spec2: Specification<T>,
  ) {}

  isSatisfiedBy(candidate: T): boolean {
    return (
      this.spec1.isSatisfiedBy(candidate) || this.spec2.isSatisfiedBy(candidate)
    );
  }
}

export class NotSpecification<T> implements Specification<T> {
  constructor(private spec: Specification<T>) {}

  isSatisfiedBy(candidate: T): boolean {
    return !this.spec.isSatisfiedBy(candidate);
  }
}
