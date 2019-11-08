import { JsonRpcError } from "./JsonRpcError";
import { JsonRpcResult } from "./JsonRpcResult";

export type JsonRpcResponse = JsonRpcResult | JsonRpcError;

export function isOk(response: JsonRpcResponse): response is JsonRpcResult {
    return (response as JsonRpcResult).result !== undefined;
}

export function isError(response: JsonRpcResponse): response is JsonRpcError {
    return (response as JsonRpcError).error !== undefined;
}

