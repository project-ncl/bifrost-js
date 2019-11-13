import { BufferedLogWriter } from "./BufferedLogWriter";

const template: HTMLTemplateElement = document.createElement("template");

template.innerHTML = `
<style>
    [data-theme="dark"] {
        --lv-text-color: rgb(186, 193, 202);
        --lv-bg-color: rgb(37, 37, 37);
        --lv-hover-bg-color: rgb(39, 44, 53);
        --lv-toolbar-text-color: rgb(161, 164, 161);
        --lv-toolbar-bg-color: rgb(51, 51 ,51);

        --lv-warn-text-color: rgb(254, 227, 169);
        --lv-warn-bg-color: rgb(50, 43, 8);
        --lv-warn-border-color: rgb(103, 86, 22);

        --lv-error-text-color: rgb(194, 108, 122);
        --lv-error-bg-color: rgb(37, 2, 1);
        --lv-error-border-color: rgb(86, 11, 6);
    }

    .container {
        width: 100%
        position: absolute;
        font-family: 'Source Code Pro', monospace;
        font-weight: light;
        font-size: 9pt;
        scroll-behavior: smooth;
        background-color: var(--lv-bg-color);
        color: var(--lv-text-color);
    }

    .content {
        word-wrap: break-word;
        padding: 5px;
    }

    .toolbar {
        position: sticky;
        opacity: 0.8;
        top: 0;
        background-color: var(--lv-toolbar-bg-color);
        padding: 10px;
    }

    .line {
        width: 100%;
    }

    .line:hover {
        background-color: var(--lv-hover-bg-color);
    }

    .line.error {
        background-color: var(--lv-error-bg-color);
        color: var(--lv-error-text-color);
        border: 1px var(--lv-error-border-color);
        border-style: solid none;
    }

    .line.warn {
        background-color: var(--lv-warn-bg-color);
        color: var(--lv-warn-text-color);
        border: 1px var(--lv-warn-border-color);
        border-style: solid none;
    }
</style>

<div class="container" data-theme="dark">
    <span id="top"></span>
    <div class="toolbar">
        <button id="btn-go-top">&#9650; Top</button>
        <button id="btn-go-bottom">&#9660; End</button>
        <button id="btn-toggle-follow">Follow</button>
        <button id="btn-load-more">&#9650; Load more</button>
    </div>
    <div class="content"></div>
    <span id="end"></span>
</div>
`;

export class LogViewer extends HTMLElement {

    private logContainer!: HTMLDivElement;

    private buffer?: BufferedLogWriter;

    private follow: boolean = false;

    public constructor() {
        super();
        const root: ShadowRoot = this.attachShadow({ mode: "open" });
        root.appendChild(template.content.cloneNode(true));
    }

    public connectedCallback(): void {
        this.logContainer = this.$(".content") as HTMLDivElement;
        this.buffer = new BufferedLogWriter(this.logContainer);
        this.buffer.onPostFlush(() => this.doFollowLog());

        this.$("#btn-go-bottom").addEventListener("click", () => this.scrollToBottom());
        this.$("#btn-go-top").addEventListener("click", () => this.scrollToTop());
        this.$("#btn-toggle-follow").addEventListener("click", () => this.toggleFollow());

    }

    public appendLine(text: string): void {
        this.buffer.queueAppend(this.createLineElement(text));
    }

    public appendLines(text: string[]): void {
        this.logContainer.appendChild(this.createFragment(text));
    }

    public scrollToBottom(): void {
        this.$("#end").scrollIntoView();
    }

    public scrollToTop(): void {
        this.follow = false;
        this.$("#top").scrollIntoView();
    }

    public toggleFollow(): void {
        this.follow = !this.follow;
    }

    private $(selector: string): HTMLElement | null {
        return this.shadowRoot && this.shadowRoot.querySelector(selector);
    }

    private createLineElement(text: string): HTMLDivElement {
        const elem: HTMLDivElement = document.createElement("div");
        if (text.includes("ERROR")) {
            elem.setAttribute("class", "line error");
        } else if (text.includes("WARN")) {
            elem.setAttribute("class", "line warn");
        } else {
            elem.setAttribute("class", "line");
        }
        //elem.setAttribute("class", "line");
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

    private doFollowLog(): void {
        if (this.follow) {
            this.scrollToBottom();
        }

    }
}

customElements.define("log-viewer", LogViewer);
