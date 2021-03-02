import { GetLinesDto } from "../src/dto/GetLinesDto";
import { LineDto } from "../src/dto/LineDto";
import { BifrostRestClient } from "../src/rest/BifrostRestClient";


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


describe("Bifrost REST client", () => {
    let restClient: BifrostRestClient;

    beforeEach(() => {
        fetchMock.resetMocks();
        restClient = new BifrostRestClient("https://localhost");
    });

    it("should call the correct URL with correct serialized params when making a GetLines request", async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));

        await restClient.getLines(getLinesRequest1);

        expect(fetchMock.mock.calls.length).toEqual(1);
        expect(fetchMock.mock.calls[0][0]).toEqual("https://localhost?maxLines=3&prefixFilters=loggerName.keyword:org.jboss.pnc._userlog_&matchFilters=mdc.processContext.keyword:build-294&afterLine=%7B%22id%22%3A%22log%23AW2wFneHGrAoEh-YUBAB%22%2C%22last%22%3Afalse%2C%22logger%22%3A%22org.jboss.pnc._userlog_.build-log%22%2C%22message%22%3A%22%2B%20mvn%20clean%20deploy%5Cn%22%2C%22timestamp%22%3A%222019-10-09T10%3A35%3A25.336Z%22%7D&direction=DESC");
    });
});
