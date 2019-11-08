import { JsonRpcMessage } from "./JsonRpcMessage";

export interface JsonRpcError extends JsonRpcMessage {
    error: {
        code: number,

        message: string,

        data?: any,
    };
}
