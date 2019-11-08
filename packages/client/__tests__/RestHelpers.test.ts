import { queryStringify } from "../src/rest/Helpers";

describe("queryStringify helper function", () => {
    it("should stringify parameters and also URL encode object parameters and return a correctly formatted queryString to match the Bifrost API", () => {
        const dto: any = {
            stringParam: "stringValue",
            numberParam: 5,
            booleanParam: true,
            objectParam: {
                foo: "bar"
            }
        };

        const q: string = queryStringify(dto);

        expect(q).toEqual(`?stringParam=${dto.stringParam}&numberParam=${dto.numberParam}&booleanParam=${dto.booleanParam}&objectParam=${encodeURIComponent(JSON.stringify(dto.objectParam))}`);
    });
});
