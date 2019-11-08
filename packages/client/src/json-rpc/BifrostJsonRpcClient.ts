import { DeferredManager } from "../common/DeferredManager";
import { Consumer } from "../common/GenericTypes";
import { Logger } from "../common/Logger";
import { isAck } from "../dto/Ack";
import { Result } from "../dto/Result";
import { JsonRpcError } from "./JsonRpcError";
import { JsonRpcId } from "./JsonRpcMessage";
import { JsonRpcRequest, JsonRpcRequestParams } from "./JsonRpcRequest";
import { isOk, JsonRpcResponse } from "./JsonRpcResponse";


export class BifrostJsonRpcClient {
    private url: string;
    private logger: Logger;
    private ws!: WebSocket;
    private requestCounter: number = 0;

    private deferredManager: DeferredManager<JsonRpcId, Result> = new DeferredManager();

    private messageListeners: Array<Consumer<Result>> = [];
    private errorListeners: Array<Consumer<JsonRpcError>> = [];

    private preOpenQueue: JsonRpcRequest[] = [];

    constructor(url: string, verbose: boolean = false) {
        this.logger = new Logger("BifrostJsonRpcClient", verbose);
        this.url = url;
        this.connect();
    }

    public close(): Promise<CloseEvent> {
        return new Promise(resolve => {
            if (this.ws.readyState === this.ws.CLOSED) {
                resolve();
                return;
            }
            this.ws.addEventListener("close", event => resolve(event));
            this.ws.close(1000, "Client session finished");
        });
    }

    public onMessage(consumer: Consumer<Result>): void {
        this.messageListeners.push(consumer);
    }

    public onError(errorListener: Consumer<JsonRpcError>): void {
        this.errorListeners.push(errorListener);
    }

    public send(method: string, params: JsonRpcRequestParams): Promise<Result> {
        const id = this.nextRequestId();

        const promise = this.deferredManager.defer(id);

        const req: JsonRpcRequest = {
            jsonrpc: "2.0",
            id,
            method,
            params,
        };

        if (this.ws.readyState > 0) {
            this.doSend(req);
        } else {
            this.preOpenQueue.push(req);
        }

        return promise;
    }

    private connect(): void {
        this.ws = new WebSocket(this.url);

        this.ws.addEventListener("open", (): void => {
            this.logger.info("Connected to Bifrost server at %s", this.url);
            this.preOpenQueue.forEach(req => this.doSend(req));
        });

        this.ws.addEventListener("message", (event: MessageEvent) => {
            let response: JsonRpcResponse;

            try {
                response = JSON.parse(event.data.toString());
                this.logger.info("<== Received: %s", JSON.stringify(response, null, 2));
            } catch (error) {
                this.logger.error("Error parsing message as JSON: %O", response);
                return;
            }

            if (isOk(response)) {
               if (isAck(response.result)) {
                   this.deferredManager.resolve(response.id, response.result);
               } else {
                    this.notifyResultListeners(response.result as Result);
               }
            } else {
                this.notifyErrorListeners(response);
            }
        });

        this.ws.addEventListener("error", (event: any): void => {
            this.logger.error("Connection error: %s", event.message);
        });

        this.ws.addEventListener("close", (event: CloseEvent): void => {
            if (event.wasClean) {
                this.logger.info("Connection to bifrost server closed gracefully");
            } else {
                console.dir(event);
                this.logger.error("Connection to bifrost server lost: code: %s reason: %s", event.code, event.reason);
                setTimeout(() => this.connect(), 5000);
            }
        });
    }

    private doSend(req: JsonRpcRequest) {
        this.logger.info("==> Sending: %s", JSON.stringify(req, null, 2));
        this.ws.send(JSON.stringify(req));
    }

    private nextRequestId(): number {
        return this.requestCounter++;
    }

    private notifyResultListeners(result: Result): void {
        for (const listener of this.messageListeners) {
            listener(result);
        }
    }

    private notifyErrorListeners(error: JsonRpcError): void {
        for (const listener of this.errorListeners) {
            listener(error);
        }
    }

}
