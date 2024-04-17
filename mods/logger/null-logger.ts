import { Logger } from "./defs.ts";

export class NullLogger implements Logger {
  public extend(): Logger {
    return this;
  }

  private log() {
    // nothing
  }

  public silly(): void {
    // nothing
  }

  public debug(): void {
    // nothing
  }

  public info(): void {
    // nothing
  }

  public notice(): void {
    // nothing
  }

  public warn(): void {
    // nothing
  }

  public error(): void {
    // nothing
  }

  public fatal(): void {
    // nothing
  }
}

export const nullLogger = new NullLogger();
