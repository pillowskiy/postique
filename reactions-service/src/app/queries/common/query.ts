import { IQuery } from '@nestjs/cqrs';

interface IQueryHandler<I extends IQuery = any, O = void> {
  execute(input: I): Promise<O>;
}

export abstract class Query<I extends IQuery, O>
  implements IQueryHandler<I, O>
{
  async execute(input: I): Promise<O> {
    const result: O = await this.invoke(input);
    return result;
  }

  protected abstract invoke(input: I): Promise<O> | O;
}
