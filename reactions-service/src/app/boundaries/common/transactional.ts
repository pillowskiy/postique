export abstract class Transactional {
  abstract start(): Promise<void>;
  abstract commit(): Promise<void>;
  abstract rollback(): Promise<void>;
}
