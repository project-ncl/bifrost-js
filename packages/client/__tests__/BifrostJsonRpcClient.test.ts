import WS from "jest-websocket-mock";
import { Result } from "../src/dto/Result";
import { SubscribeDto } from "../src/dto/SubscribeDto";
import { BifrostJsonRpcClient } from "../src/json-rpc/BifrostJsonRpcClient";
import { JsonRpcRequestParams } from "../src/json-rpc/JsonRpcRequest";
import { JsonRpcResult } from "../src/json-rpc/JsonRpcResult";

const mockResult1: JsonRpcResult = {
    result: {
      type: "org.jboss.pnc.bifrost.endpoint.websocket.LineResult",
      value: {
        id: "log#AW2wFneef9GWzOwP7kQ9",
        last: false,
        logger: "org.jboss.pnc._userlog_.build-log",
        message: "HEAD is now at b94bb49 Repour\n",
        timestamp: "2019-10-09T10:35:25.335Z"
      }
    },
    id: 0,
    jsonrpc: "2.0"
  };

const mockGetLines1: JsonRpcRequestParams = {
    maxLines: 10,
    prefixFilters: "loggerName.keyword:org.jboss.pnc._userlog_",
    matchFilters: "mdc.processContext.keyword:build-294",
};


describe("JsonRpcClient", () => {
    const WS_URL: string = "ws://localhost:7890";
    let server: WS;
    let client: BifrostJsonRpcClient;


    beforeEach(async () => {
        server = new WS(WS_URL, { jsonProtocol: true });

        client = new BifrostJsonRpcClient(WS_URL);

        await server.connected;
    });

    afterEach(async () => {
        await client.close();
        WS.clean();
    });

    it("should deserialize received messages and invoke all handlers with the result", () => {
        // given
        const received1: Result[] = [];
        const received2: Result[] = [];

        client.onMessage(msg => {
            received1.push(msg);
        });

        client.onMessage(msg => {
            received2.push(msg);
        });

        // when
        server.send(mockResult1);

        // then
        expect(received1).toHaveLength(1);
        expect(received2).toHaveLength(1);
        expect(received1[0]).toEqual(mockResult1.result);
        expect(received2[0]).toEqual(mockResult1.result);

    });

    it("should send valid JSON-RPC messages to the server", async () => {
        // when
        client.send("GET-LINES", {
            maxLines: 10,
            prefixFilters: "loggerName.keyword:org.jboss.pnc._userlog_",
            matchFilters: "mdc.processContext.keyword:build-294",
        });

        // then
        await expect(server).toReceiveMessage({
            jsonrpc: "2.0",
            id: 0,
            method: "GET-LINES",
            params: {
                maxLines: 10,
                prefixFilters: "loggerName.keyword:org.jboss.pnc._userlog_",
                matchFilters: "mdc.processContext.keyword:build-294"
            }
        });

    });

    it("should increment the id with each message", async () => {
        // when
        client.send("GET-LINES", {
            maxLines: 10,
            prefixFilters: "loggerName.keyword:org.jboss.pnc._userlog_",
            matchFilters: "mdc.processContext.keyword:build-294",
        });

        await server.nextMessage;

        client.send("GET-LINES", {
            maxLines: 10,
            prefixFilters: "loggerName.keyword:org.jboss.pnc._userlog_",
            matchFilters: "mdc.processContext.keyword:build-294",
        });

        await server.nextMessage;

        // then
        expect(server).toHaveReceivedMessages([
            {
                jsonrpc: "2.0",
                id: 0,
                method: "GET-LINES",
                params: {
                    maxLines: 10,
                    prefixFilters: "loggerName.keyword:org.jboss.pnc._userlog_",
                    matchFilters: "mdc.processContext.keyword:build-294"
                }
            },
            {
                jsonrpc: "2.0",
                id: 1,
                method: "GET-LINES",
                params: {
                    maxLines: 10,
                    prefixFilters: "loggerName.keyword:org.jboss.pnc._userlog_",
                    matchFilters: "mdc.processContext.keyword:build-294"
                }
            }
        ]);
    });

    it("should return a promise resolved with an OkResult, when the user issues a GET-LINES command", async () => {
        // given
        let promise: Promise<Result>;

        // when
        promise = client.send("GET-LINES", mockGetLines1);

        await server.nextMessage;

        server.send({
            result: {
              type: "org.jboss.pnc.bifrost.endpoint.websocket.OkResult"
            },
            id: 0,
            jsonrpc: "2.0"
        });

        const result: Result = await promise;

        //then
        expect(result.type).toEqual("org.jboss.pnc.bifrost.endpoint.websocket.OkResult");
    });

    it("should return a promise resolved with a SubscribeResult when the user issues a SUBSCRIBE command", async () => {
        // given

        let promise: Promise<Result>;

        const params: SubscribeDto = {
            matchFilters: "matchFilter",
            prefixFilters: "prefixFilter"
        };

        // when
        promise = client.send("SUBSCRIBE", params);

        await server.nextMessage;

        server.send(
            {
                result: {
                    type: "org.jboss.pnc.bifrost.endpoint.websocket.SubscribeResultDto",
                    value: "mdc.processContext.keyword:build-320loggerName.keyword:org.jboss.pnc._userlog_"
                },
                id: 0,
                jsonrpc: "2.0"
            }
        );

        const result: Result = await promise;

        expect(result.type).toEqual("org.jboss.pnc.bifrost.endpoint.websocket.SubscribeResultDto");
    });

    it("should only pass LineResults to an onMessage callback", () => {
        // given
        const messageToSend: JsonRpcResult = {
            result:
            {
                type: "org.jboss.pnc.bifrost.endpoint.websocket.LineResult",
                value: {
                    id: "log#AW4CxieQ8h2hDoMaNJaq",
                    last: false,
                    logger: "org.jboss.pnc._userlog_.process-stage-update",
                    message: "BEGIN: Enqueued ",
                    subscriptionTopic: "mdc.processContext.keyword:build-320loggerName.keyword:org.jboss.pnc._userlog_",
                    timestamp: "2019-10-25T11:56:10.759Z"
                }
            },
            id: 0,
            jsonrpc: "2.0"
        };

        const mockCallback = jest.fn();

        client.onMessage(mockCallback);

        // when

        server.send(messageToSend);
        server.send(messageToSend);
        server.send(messageToSend);

        // then

        expect(mockCallback.mock.calls.length).toEqual(3);

        expect(mockCallback.mock.calls[0][0].type).toEqual("org.jboss.pnc.bifrost.endpoint.websocket.LineResult");
    });

});
