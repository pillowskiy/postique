export interface ITransactional {
  start(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}
