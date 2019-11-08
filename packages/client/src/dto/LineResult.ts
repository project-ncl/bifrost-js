import { LineDto } from "./LineDto";
import { Result } from "./Result";

export interface LineResult extends Result {
    type: "org.jboss.pnc.bifrost.endpoint.websocket.LineResult";
    value: LineDto;
}

export function isLineResult(result: Result): result is LineResult {
    return result.type === "org.jboss.pnc.bifrost.endpoint.websocket.LineResult";
}
