import { ActionHandler, defineAction } from "../../flow/action.ts";
import { defineSecurityPolicy } from "../../flow/auth.ts";
import { success } from "../../useful/result.ts";
import { HealthOutput, healthEndpointContract } from "./common.ts";

export const healthActionContract = defineAction<null, HealthOutput>({
  key: 'health-read',
  mutation: false,
  security: defineSecurityPolicy(),
});

export class HealthActionHandler implements ActionHandler<typeof healthActionContract> {
  async handle() {
    const payload: HealthOutput = {
      date: new Date(),
      status: 'UP',
    };
    return success(payload);
  }
}

export function provideHealthActionHandler() {
  return new HealthActionHandler();
}

export const provideHealthWebHandler = createActionWebHandler(healthEndpointContract, healthActionContract);
