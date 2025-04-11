import { Transactional } from '@/app/boundaries/common';
import { ApplicationException } from '@/app/boundaries/errors';
import { Inject } from '@nestjs/common';
import { ICommand } from '@nestjs/cqrs';

interface ICommandHandler<I extends ICommand = any, O = void> {
  execute(input: I): Promise<O>;
}

export abstract class Command<I extends ICommand = any, O = any>
  implements ICommandHandler<I, O>
{
  @Inject(Transactional)
  protected readonly _transactional: Transactional;

  protected abstract invoke(input: I): O | Promise<O>;

  public async execute(input: I): Promise<O> {
    await this._transactional.start();

    try {
      const result = await this.invoke(input);
      await this._transactional.commit();
      //this._dispatcher.dispatch();
      return result;
    } catch (error) {
      await this._transactional.rollback();
      throw ApplicationException.parse(error);
    }
  }
}
