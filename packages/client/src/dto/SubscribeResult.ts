import { Result } from "./Result";

export interface SubscribeResult extends Result {
    type: "org.jboss.pnc.bifrost.endpoint.websocket.SubscribeResultDto";

    value: string;
}

export function isSubscribeResult(result: Result): result is SubscribeResult {
    return result.type === "org.jboss.pnc.bifrost.endpoint.websocket.SubscribeResultDto";
}
