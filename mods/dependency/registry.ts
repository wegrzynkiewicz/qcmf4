import { Breaker } from "../assert/breaker.ts";

export type RegistryIndex = number | string | symbol;

export class Registry<TInstance, TIndex extends RegistryIndex = RegistryIndex> {
  public readonly entries = new Map<TIndex, TInstance>();

  public constructor(
    private resolveKey: (entry: TInstance) => TIndex,
  ) {}

  public register(entry: TInstance): void {
    const key = this.resolveKey(entry);
    if (this.entries.has(key)) {
      throw new Breaker("register-entry-with-current-key-already-exists", { key });
    }
    this.entries.set(key, entry);
  }
}
