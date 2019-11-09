export interface JsonRpcMessage {
    jsonrpc: "2.0";

    id: JsonRpcId;
}

export type JsonRpcId = string | number;
