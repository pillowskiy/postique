import { Inject } from '@nestjs/common';
import {
  IEventDispatcher,
  ITransactional,
  BaseToken,
} from '@/app/boundaries/common';

export abstract class Command<I = void, O = void> {
  @Inject(BaseToken.EventDispatcher)
  protected _dispatcher: IEventDispatcher;

  @Inject(BaseToken.Transactional)
  protected _transactional: ITransactional;

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
