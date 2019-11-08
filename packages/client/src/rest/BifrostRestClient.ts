import { GetLinesDto } from "../dto/GetLinesDto";
import { LineDto } from "../dto/LineDTO";
import { processResponse, queryStringify } from "./Helpers";

export class BifrostRestClient {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    public async getLines(params: GetLinesDto): Promise<LineDto[]> {
        return await this.request(params);
    }

    private async request<T>(params: any): Promise<T> {
        const resp: Response = await fetch(`${this.url}${queryStringify(params)}`);
        return await processResponse(resp);
    }
}
