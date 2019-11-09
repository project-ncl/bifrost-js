import { JsonRpcMessage } from "./JsonRpcMessage";

export interface JsonRpcRequest extends JsonRpcMessage {
    method: string;

    params: JsonRpcRequestParams;
}

export interface JsonRpcRequestParams {
    [Key: string]: any;
}
