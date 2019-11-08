import { Result } from "./Result";

export interface OkResult extends Result {
    type: "org.jboss.pnc.bifrost.endpoint.websocket.OkResult";
}

export function isOkResult(result: Result): result is OkResult {
    return result.type === "org.jboss.pnc.bifrost.endpoint.websocket.OkResult";
}

