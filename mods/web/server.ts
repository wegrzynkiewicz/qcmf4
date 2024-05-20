import { Breaker } from "../assert/breaker.ts";
import { ServiceResolver } from "../dependency/service-resolver.ts";
import { Logger, provideLogger } from "../logger/defs.ts";
import { withResolvers } from "../useful/async.ts";
import { WebServerConfig, WebServerHandler, provideWebServerConfig } from "./defs.ts";
import { provideWebRouter } from "./router.ts";

export function truncateRequestSensitiveHeaders(headers: Headers): Record<string, string> {
  const copyHeaders = new Headers(headers);
  const authorization = copyHeaders.get('authorization');
  if (authorization) {
    const part = authorization.substring(0, 15);
    copyHeaders.set("authorization", `${part}... [truncated]`);
  }
  const raw = Object.fromEntries(copyHeaders.entries());
  return raw;
}

export class WebServer {
  private readonly abortController = new AbortController();

  public constructor(
    private readonly config: WebServerConfig,
    private readonly handler: WebServerHandler,
    private readonly logger: Logger,
  ) { }

  public async listen(): Promise<void> {
    const { hostname, port } = this.config;
    const listing = withResolvers();
    try {
      Deno.serve({
        handler: this.handle.bind(this),
        hostname,
        onError: this.handleError.bind(this),
        onListen: () => {
          this.handleListen();
          listing.resolve();
        },
        port,
        signal: this.abortController.signal,
      });
    } catch (error: unknown) {
      const breaker = new Breaker('error-inside-web-server-listen', { error, ...this.config });
      listing.reject(breaker);
    }
    return listing.promise;
  }

  public close(reason: string): void {
    this.logger.info("web-server-aborting", { reason });
    this.abortController.abort(reason);
  }

  private async handle(request: Request): Promise<Response> {
    const { method, url } = request;
    const headers = truncateRequestSensitiveHeaders(request.headers);
    this.logger.silly("web-server-request", { headers, method, url });
    try {
      const response = await this.handler.handle(request);
      const { status } = response;
      this.logger.silly("web-server-response", { status, method, url });
      return response;
    } catch (error) {
      throw new Breaker("error-inside-web-server-handle", { error, headers, method, url });
    }
  }

  private handleError(error: unknown): Response {
    const payload = { error: "internal-server-error" };
    const response = Response.json(payload, { status: 500 });
    const msg = "error-inside-web-server-handle-error";
    const breaker = new Breaker(msg, { error });
    this.logger.error(msg, { error: breaker });
    return response;
  }

  private handleListen(): void {
    this.logger.info("web-server-listening");
  }
}

export function provideWebServer(resolver: ServiceResolver) {
  return new WebServer(
    resolver.resolve(provideWebServerConfig),
    resolver.resolve(provideWebRouter),
    resolver.resolve(provideLogger),
  );
}
