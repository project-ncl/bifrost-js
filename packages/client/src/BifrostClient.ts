import { Consumer } from "./common/GenericTypes";
import { GetLinesDto } from "./dto/GetLinesDto";
import { LineDto } from "./dto/LineDto";
import { isLineResult } from "./dto/LineResult";
import { Result } from "./dto/Result";
import { SubscribeDto } from "./dto/SubscribeDto";
import { SubscribeResult } from "./dto/SubscribeResult";
import { BifrostJsonRpcClient } from "./json-rpc/BifrostJsonRpcClient";
import { BifrostRestClient } from "./rest/BifrostRestClient";

export class BifrostClient {
    private host: string;

    private rpcClient: BifrostJsonRpcClient;
    private restClient: BifrostRestClient;

    private subscriptionStore: Record<string, Consumer<LineDto>> = {};

    constructor(host: string, verbose: boolean = false) {
        this.host = host;

        this.rpcClient = new BifrostJsonRpcClient(`ws://${this.host}/socket`, verbose);

        this.rpcClient.onMessage(result => this.onReceiveResult(result));

        this.restClient = new BifrostRestClient(`http://${this.host}/`);
    }

    public close(): Promise<CloseEvent> {
        return this.rpcClient.close();
    }

    public getLines(params: GetLinesDto): Promise<LineDto[]> {
        return this.restClient.getLines(params);
    }

    public async subscribe(subscribe: SubscribeDto, consumer: Consumer<LineDto>): Promise<string> {
        const resp: SubscribeResult = await this.rpcClient.send("SUBSCRIBE", subscribe) as SubscribeResult;
        this.subscriptionStore[resp.value] = consumer;
        return resp.value;
    }

    private onReceiveResult(result: Result): void {
        if (isLineResult(result)) {
            const handle = this.subscriptionStore[result.value.subscriptionTopic];

            if (!handle) {
                return;
            }
            handle(result.value);
        }
    }
}
