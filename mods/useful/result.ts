export type Success<T> = [true, T];
export type Failure<T> = [false, T];

export type Result<TSuccess, TFailure> = Success<TSuccess> | Failure<TFailure>;

export const failure = <T>(error: T): Failure<T> => [false, error];
export const success = <T>(data: T): Success<T> => [true, data];

