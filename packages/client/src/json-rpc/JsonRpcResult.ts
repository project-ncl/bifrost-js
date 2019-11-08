import { Result } from "../dto/Result";
import { JsonRpcMessage } from "./JsonRpcMessage";

export interface JsonRpcResult extends JsonRpcMessage {
    result: Result;
}
