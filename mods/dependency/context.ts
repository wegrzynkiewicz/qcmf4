import { ServiceResolver } from "./service-resolver.ts";

export interface Context<TIdentifier> {
  description: string;
  identifier: TIdentifier;
  resolver: ServiceResolver;
}
