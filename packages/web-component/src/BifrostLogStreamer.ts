import { BufferedLogWriter } from "./BufferedLogWriter";

const template: HTMLTemplateElement = document.createElement("template");

template.innerHTML = `
<style>
    .bifrost-container {

        --bifrost-content-bgcolor: 37, 37, 37;
        --bifrost-content-color: 186, 193, 202;
        --bifrost-toolbar-bgcolor: 51, 51 ,51;
        --bifrost-toolbar-color: 161, 164, 161;

        position: relative;
        font-family: 'Source Code Pro', monospace;
        font-weight: light;
        font-size: 9pt;
        scroll-behavior: smooth;
        background-color: rgba(var(--bifrost-toolbar-bgcolor), 1.0);
    }

    .bifrost-toolbar {
        position: sticky;
        opacity: 0.8;
        top: 0;
        background-color: rgba(var(--bifrost-toolbar-bgcolor), 1.0);
        padding: 10px;
    }

    .bifrost-content {
        background-color: rgba(var(--bifrost-content-bgcolor), 1.0);
        color: rgba(var(--bifrost-content-color), 1.0);
        word-wrap: break-word;
        padding: 0 20px;
    }
    .log-line {
        width: 100%;
    }
</style>
<div class="bifrost-container">
    <div id="bifrost-top">&nbsp;</div>
    <div class="bifrost-toolbar">
        <button id="btn-go-bottom">To Bottom</button>
        <button id="btn-go-top">To Top</button>
        <button id="btn-toggle-follow">Follow</button>
    </div>
    <div class="bifrost-content">
        <div class="log-line">&nbsp;</div>
    </div>
    <div id="bifrost-bottom">&nbsp;</div>
</div>
`;

export class BifrostLogStreamer extends HTMLElement {

    private logContainer!: HTMLDivElement;

    private buffer?: BufferedLogWriter;

    private follow: boolean = false;

    public constructor() {
        super();
        const root: ShadowRoot = this.attachShadow({ mode: "open" });
        root.appendChild(template.content.cloneNode(true));
    }

    public connectedCallback(): void {
        this.logContainer = this.$(".bifrost-content") as HTMLDivElement;
        this.buffer = new BufferedLogWriter(this.logContainer);

        this.$("#btn-go-bottom").addEventListener("click", () => this.scrollToBottom());
        this.$("#btn-go-top").addEventListener("click", () => this.scrollToTop());
    }

    public appendLine(text: string): void {
        this.buffer.queueAppend(this.createLineElement(text));
        // this.logContainer.appendChild(this.createLineElement(text));
    }

    public appendLines(text: string[]): void {
        this.logContainer.appendChild(this.createFragment(text));
    }

    public scrollToBottom(): void {
        this.$("#bifrost-bottom").scrollIntoView();
    }

    public scrollToTop(): void {
        this.$("#bifrost-top").scrollIntoView();
    }

    public toggleFollow(): void {
        this.follow = !this.follow;
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
