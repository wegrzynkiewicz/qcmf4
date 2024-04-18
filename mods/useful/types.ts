export type UnknownStructure<T> = {
  [K in keyof T]?: T[K] extends object ? UnknownStructure<T[K]> : unknown;
};
