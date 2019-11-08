import { isOkResult, OkResult } from "./OkResult";
import { Result } from "./Result";
import { isSubscribeResult, SubscribeResult } from "./SubscribeResult";

export type Ack = SubscribeResult | OkResult;

export function isAck(result: Result): result is Ack {
    return isOkResult(result) || isSubscribeResult(result);
}

