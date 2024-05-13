export type UnknownStructure<T> = {
  [K in keyof T]?: T[K] extends object ? UnknownStructure<T[K]> : unknown;
};

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type InferArray<T> = T extends Array<infer U> ? U : never;

export type UnionToIntersection<T> = Expand<
  (T extends unknown ? (k: T) => void : never) extends ((k: infer I) => void) ? I : never
>;
