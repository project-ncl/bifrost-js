import { BufferedLogWriter } from "./BufferedLogWriter";

const template: HTMLTemplateElement = document.createElement("template");

template.innerHTML = `
<style>
    .log-container {
        position: relative;
        background-color: #293134;
        font-family: 'Source Code Pro', monospace;
        word-wrap: break-word;
        color: #E0E2E4;
        padding: 0 20px;
    }
    .log-line {
        width: 100%;
    }
</style>
<div class="log-container"></div>
`;

export class BifrostLogStreamer extends HTMLElement {

    private logContainer!: HTMLDivElement;

    private buffer?: BufferedLogWriter;

    public constructor() {
        super();
        const root: ShadowRoot = this.attachShadow({ mode: "open" });
        root.appendChild(template.content.cloneNode(true));
    }

    public connectedCallback(): void {
        this.logContainer = this.$(".log-container") as HTMLDivElement;
        this.buffer = new BufferedLogWriter(this.logContainer);
    }

    public appendLine(text: string): void {
        this.buffer.queueAppend(this.createLineElement(text));
        // this.logContainer.appendChild(this.createLineElement(text));
    }

    public appendLines(text: string[]): void {
        this.logContainer.appendChild(this.createFragment(text));
    }

    private $(selector: string): HTMLElement | null {
        return this.shadowRoot && this.shadowRoot.querySelector(selector);
    }

    private createLineElement(text: string): HTMLDivElement {
        const elem: HTMLDivElement = document.createElement("div");
        elem.setAttribute("class", "log-line");
        elem.appendChild(document.createTextNode(text));
        return elem;
    }

    private createFragment(text: string[]): DocumentFragment {
        const frag: DocumentFragment = document.createDocumentFragment();

        text.forEach((line) => {
            const elem: HTMLDivElement = this.createLineElement(line);
            frag.appendChild(elem);
        });

        return frag;
    }
}

customElements.define("bifrost-log-streamer", BifrostLogStreamer);
