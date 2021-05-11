import { GlobalWithFetchMock } from "jest-fetch-mock";
import { WebSocket } from "mock-socket";

const globalWithFetchMock = global as unknown as GlobalWithFetchMock;
// tslint:disable-next-line: no-var-requires
globalWithFetchMock.fetch = require("jest-fetch-mock");
globalWithFetchMock.fetchMock = globalWithFetchMock.fetch;

const globalWithWebSocketMock = global as any;
globalWithWebSocketMock.WebSocket = WebSocket;
