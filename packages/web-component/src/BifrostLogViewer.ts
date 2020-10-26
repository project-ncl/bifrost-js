
import BifrostClient from "@project-ncl/bifrost-client";
import { GetLinesDto } from "@project-ncl/bifrost-client/dist/types/dto/GetLinesDto";
import { LineDto } from "@project-ncl/bifrost-client/dist/types/dto/LineDTO";
import { SubscribeDto } from "@project-ncl/bifrost-client/dist/types/dto/SubscribeDto";
import LogViewer from "./LogViewer";

const template: HTMLTemplateElement = document.createElement("template");

template.innerHTML = `
<log-viewer></log-viewer>
`;

export default class BifrostLogViewer extends HTMLElement {

    private bifrostHost: string;
    private subscriptionParams: SubscribeDto;
    private client: BifrostClient;
    private logViewer: LogViewer;
    private topLine: LineDto = null;

    constructor(bifrostHost: string, subscriptionParams: SubscribeDto) {
        super();
        this.bifrostHost = bifrostHost;
        this.subscriptionParams = subscriptionParams;
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public disconnect() {
        this.client.close();
    }

    protected connectedCallback() {
        this.client = new BifrostClient(this.bifrostHost);
        this.logViewer = this.shadowRoot.querySelector("log-viewer");
        this.init();
        this.logViewer.addEventListener("onLoadMore", () => this.loadMore());
    }

    protected disconnectedCallback() {
        this.disconnect();
    }

    private init() {
        this.client.subscribe(this.subscriptionParams, (line: LineDto) => {
            if (this.topLine === null) {
                this.topLine = line;
            }
            this.logViewer.appendLine(`[${line.timestamp}] ${line.message}`);

            if (line.stackTrace) {
                this.logViewer.appendLine(`Stack Trace: ${line.stackTrace}`);
            }
        });
    }

    private async loadMore() {
        if (this.topLine && this.topLine.last) {
            console.info("No further lines to load");
            return;
        }

        const req: GetLinesDto = {
            ...this.subscriptionParams,
            direction: "DESC",
            maxLines: 50
        };

        if (this.topLine) {
            req.afterLine = this.topLine;
        }

        let lines;
        try {
            const resp = await this.client.getLines(req);
            lines = resp.map(line => `[${line.timestamp}] ${line.message}`);
            this.topLine = resp[0];
        } catch (e) {
            console.error(`Error fetching lines: ${ e.message }`);
        }

        this.logViewer.prependLines(lines);
    }


}

customElements.define("bifrost-log-viewer", BifrostLogViewer);
