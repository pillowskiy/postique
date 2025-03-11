export abstract class Query<I, O> {
  async execute(input: I): Promise<O> {
    const result: O = await this.invoke(input);
    return result;
  }

  protected abstract invoke(input: I): Promise<O> | O;
}
