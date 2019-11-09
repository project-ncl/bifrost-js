import WS from "jest-websocket-mock";
import { BifrostClient } from "../src/BifrostClient";
import { GetLinesDto } from "../src/dto/GetLinesDto";
import { LineDto } from "../src/dto/LineDto";

describe("Bifrost client", () => {

    const SERVER_HOST: string = "localhost:7890";
    const WS_URL: string = `ws://${SERVER_HOST}/socket`;

    let server: WS;
    let client: BifrostClient;
    let clientSocket: WebSocket;

    beforeEach(async () => {
        server = new WS(WS_URL, { jsonProtocol: true });

        client = new BifrostClient(SERVER_HOST);

        clientSocket = await server.connected;
    });

    afterEach(async () => {
        await client.close();
        WS.clean();
        fetchMock.resetMocks();
    });

    it("should connect to the WebSocket", async () => {
        const socketInstance: WebSocket | null = await server.connected;

        expect(socketInstance).not.toBeNull();
    });

    it("should disconnect from the WebSocket", async () => {
        const closeEvent = await client.close();

        await server.closed;

        expect(clientSocket.readyState).toEqual(clientSocket.CLOSED);

        expect(closeEvent.wasClean).toBeTruthy();
        expect(closeEvent.code).toEqual(1000);
        expect(closeEvent.reason).toEqual("Client session finished");
    });

    it("should invoke the subscription callback with relevant messages", async () => {
        const mockHandler = jest.fn();

        const promise = client.subscribe({
            matchFilters: "matchFilter",
            prefixFilters: "prefixFilter"
        }, mockHandler);

        await server.nextMessage;

        server.send({
            result: {
                type: "org.jboss.pnc.bifrost.endpoint.websocket.SubscribeResultDto",
                value: "mdc.processContext.keyword:build-320loggerName.keyword:org.jboss.pnc._userlog_"
            },
           id: 0,
           jsonrpc: "2.0"
        });

        await promise;

        server.send({
            result: {
                type: "org.jboss.pnc.bifrost.endpoint.websocket.LineResult",
                value: {
                    id: "log#AW4CxieQ8h2hDoMaNJaq",
                    last: false,
                    logger: "org.jboss.pnc._userlog_.process-stage-update",
                    message: "BEGIN: Enqueued",
                    subscriptionTopic: "mdc.processContext.keyword:build-320loggerName.keyword:org.jboss.pnc._userlog_",
                    timestamp: "2019-10-25T11:56:10.759Z"
                }
            },
           id: 0,
           jsonrpc: "2.0"
        });

        expect(mockHandler.mock.calls.length).toEqual(1);
        expect(mockHandler.mock.calls[0][0].message).toEqual("BEGIN: Enqueued");
    });

    it("should not invoke the subscription callback for other topics", async () => {
        const mockHandler = jest.fn();

        const promise = client.subscribe({
            matchFilters: "matchFilter",
            prefixFilters: "prefixFilter"
        }, mockHandler);

        await server.nextMessage;

        server.send({
            result: {
                type: "org.jboss.pnc.bifrost.endpoint.websocket.SubscribeResultDto",
                value: "mdc.processContext.keyword:build-320loggerName.keyword:org.jboss.pnc._userlog_"
            },
           id: 0,
           jsonrpc: "2.0"
        });

        await promise;

        server.send({
            result: {
                type: "org.jboss.pnc.bifrost.endpoint.websocket.LineResult",
                value: {
                    id: "log#AW4CxieQ8h2hDoMaNJaq",
                    last: false,
                    logger: "org.jboss.pnc._userlog_.process-stage-update",
                    message: "BEGIN: Enqueued",
                    subscriptionTopic: "other-topic",
                    timestamp: "2019-10-25T11:56:10.759Z"
                }
            },
           id: 0,
           jsonrpc: "2.0"
        });

        expect(mockHandler.mock.calls.length).toEqual(0);
    });

    it("should get lines", async () => {
        const getLinesRequest1: GetLinesDto = {
            maxLines: 3,
            prefixFilters: "loggerName.keyword:org.jboss.pnc._userlog_",
            matchFilters: "mdc.processContext.keyword:build-294",
            afterLine: {
                id: "log#AW2wFneHGrAoEh-YUBAB",
                last: false,
                logger: "org.jboss.pnc._userlog_.build-log",
                message: "+ mvn clean deploy\n",
                timestamp: "2019-10-09T10:35:25.336Z"
            },
            direction: "DESC"
        };

        const getLinesResponse1: LineDto[] = [
            {
                id: "log#AW2wFXZmf9GWzOwP7jpq",
                last: false,
                logger: "org.jboss.pnc._userlog_.build-process-status-update",
                message: "Build status updated to BUILDING; previous: ENQUEUED",
                timestamp: "2019-10-09T10:34:19.342Z"
            },
            {
                id: "log#AW2wFeMVf9GWzOwP7j91",
                last: false,
                logger: "org.jboss.pnc._userlog_.build-executor",
                message: "Starting build execution...",
                timestamp: "2019-10-09T10:34:46.875Z"
            },
            {
                id: "log#AW2wFeMVf9GWzOwP7j93",
                last: false,
                logger: "org.jboss.pnc._userlog_.build-executor",
                message: "Setting up repository...",
                timestamp: "2019-10-09T10:34:46.920Z"
            }
        ];

        fetchMock.mockResponseOnce(JSON.stringify(getLinesResponse1));

        const lines: LineDto[] = await client.getLines(getLinesRequest1);

        expect(lines.length).toEqual(3);
        expect(lines[0].message).toEqual("Build status updated to BUILDING; previous: ENQUEUED");
    });
});

