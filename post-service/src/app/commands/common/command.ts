import { EventDispatcher, Transactional } from '@/app/boundaries/common';

export abstract class Command<I = void, O = void> {
  constructor(
    protected readonly _dispatcher: EventDispatcher,
    protected readonly _transactional: Transactional,
  ) {}

  protected abstract invoke(input: I): Promise<O>;

  public async execute(input: I): Promise<O> {
    await this._transactional.start();

    try {
      const result = await this.invoke(input);
      await this._transactional.commit();
      this._dispatcher.dispatch();
      return result;
    } catch (error) {
      await this._transactional.rollback();
      throw error;
    }
  }
}
