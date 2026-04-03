export abstract class AbstractService<
  TArgs extends readonly unknown[] = readonly [],
  TOutput = unknown,
> {
  protected constructor() {}

  abstract execute(...args: TArgs): Promise<TOutput>;
}
