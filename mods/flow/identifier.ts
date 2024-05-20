export class Identifier {
  public constructor(
    public raw: string,
  ) { }

  public toString(): string {
    return this.raw;
  }

  public static fromString(value: string): Identifier {
    return new Identifier(value);
  }
}
