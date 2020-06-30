(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.bifrost = factory());
}(this, (function () { 'use strict';

    class BufferedLogWriter {
        constructor(containerElement) {
            this.MAX_FLUSH_SIZE = 25;
            this.appendBuffer = [];
            this.prependBuffer = [];
            this.scheduled = false;
            this.containerElement = containerElement;
        }
        queueAppend(node) {
            this.schedule();
            this.appendBuffer.push(node);
        }
        queuePrepend(node) {
            this.schedule();
            this.prependBuffer.push(node);
        }
        onPostFlush(callback) {
            this.postFlushCb = callback;
        }
        schedule() {
            if (this.scheduled) {
                return;
            }
            this.scheduled = true;
            window.requestAnimationFrame(() => {
                this.flushAppendBuffer();
                if (this.postFlushCb) {
                    this.postFlushCb();
                }
                this.flushPrependBuffer();
                this.scheduled = false;
            });
        }
        flushAppendBuffer() {
            if (this.appendBuffer.length > 0) {
                this.containerElement.append(this.doFlush(this.appendBuffer));
            }
        }
        flushPrependBuffer() {
            if (this.prependBuffer.length > 0) {
                this.containerElement.prepend(this.doFlush(this.prependBuffer));
            }
        }
        doFlush(buffer) {
            const frag = new DocumentFragment();
            for (let i = 0; this.appendBuffer.length > 0 && i < this.MAX_FLUSH_SIZE; i++) {
                frag.appendChild(buffer.shift());
            }
            return frag;
        }
    }

    const template = document.createElement("template");
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
    class LogViewer extends HTMLElement {
        constructor() {
            super();
            this.follow = false;
            const root = this.attachShadow({ mode: "open" });
            root.appendChild(template.content.cloneNode(true));
        }
        connectedCallback() {
            this.logContainer = this.$(".content");
            this.buffer = new BufferedLogWriter(this.logContainer);
            this.buffer.onPostFlush(() => this.doFollowLog());
            this.$("#btn-go-bottom").addEventListener("click", () => this.scrollToBottom());
            this.$("#btn-go-top").addEventListener("click", () => this.scrollToTop());
            this.$("#btn-toggle-follow").addEventListener("click", () => this.toggleFollow());
            this.$("#btn-load-more").addEventListener("click", () => this.dispatchEvent(new CustomEvent("onLoadMore")));
        }
        appendLine(text) {
            this.buffer.queueAppend(this.createLineElement(text));
        }
        appendLines(text) {
            this.logContainer.appendChild(this.createFragment(text));
        }
        prependLine(text) {
            this.logContainer.prepend(this.createLineElement(text));
        }
        prependLines(text) {
            this.logContainer.prepend(this.createFragment(text));
        }
        scrollToBottom() {
            this.$("#end").scrollIntoView();
        }
        scrollToTop() {
            this.follow = false;
            this.$("#top").scrollIntoView();
        }
        toggleFollow() {
            if (!this.follow) {
                this.scrollToBottom();
            }
            this.follow = !this.follow;
        }
        $(selector) {
            return this.shadowRoot && this.shadowRoot.querySelector(selector);
        }
        createLineElement(text) {
            const elem = document.createElement("div");
            if (text.includes("ERROR")) {
                elem.setAttribute("class", "line error");
            }
            else if (text.includes("WARN")) {
                elem.setAttribute("class", "line warn");
            }
            else {
                elem.setAttribute("class", "line");
            }
            elem.appendChild(document.createTextNode(text));
            return elem;
        }
        createFragment(text) {
            const frag = document.createDocumentFragment();
            text.forEach((line) => {
                const elem = this.createLineElement(line);
                frag.appendChild(elem);
            });
            return frag;
        }
        doFollowLog() {
            if (this.follow) {
                this.scrollToBottom();
            }
        }
    }
    customElements.define("log-viewer", LogViewer);

    function isLineResult(result) {
        return result.type === "org.jboss.pnc.bifrost.endpoint.websocket.LineResult";
    }

    class Deferred {
        constructor() {
            this.promise = new Promise((resolve, reject) => {
                this.resolve = resolve;
                this.reject = reject;
            });
        }
    }

    class DeferredManager {
        constructor() {
            this.deferreds = new Map();
        }
        defer(key) {
            const deffered = new Deferred();
            this.deferreds.set(key, deffered);
            return deffered.promise;
        }
        resolve(key, value) {
            this.getAndRemoveIfExists(key).resolve(value);
        }
        reject(key, reason) {
            this.getAndRemoveIfExists(key).reject(reason);
        }
        getIfExists(key) {
            if (!this.deferreds.has(key)) {
                throw new Error(`No deferred value exists for key: ${key}`);
            }
            return this.deferreds.get(key);
        }
        getAndRemoveIfExists(key) {
            const deferred = this.getIfExists(key);
            this.deferreds.delete(key);
            return deferred;
        }
    }

    class Logger {
        constructor(prefix = "", verbose = false) {
            this.prefix = prefix;
            this.verbose = verbose;
        }
        log(level, message, ...params) {
            if (!this.verbose && level !== "error") {
                return;
            }
            const prefixed = `[${this.prefix}] ${message}`;
            console[level](prefixed, ...params);
        }
        error(message, ...params) {
            this.log("error", message, ...params);
        }
        warn(message, ...params) {
            this.log("warn", message, ...params);
        }
        info(message, ...params) {
            this.log("info", message, ...params);
        }
        debug(message, ...params) {
            this.log("debug", message, ...params);
        }
    }

    function isOkResult(result) {
        return result.type === "org.jboss.pnc.bifrost.endpoint.websocket.OkResult";
    }

    function isSubscribeResult(result) {
        return result.type === "org.jboss.pnc.bifrost.endpoint.websocket.SubscribeResultDto";
    }

    function isAck(result) {
        return isOkResult(result) || isSubscribeResult(result);
    }

    function isOk(response) {
        return response.result !== undefined;
    }

    class BifrostJsonRpcClient {
        constructor(url, verbose = false) {
            this.requestCounter = 0;
            this.deferredManager = new DeferredManager();
            this.messageListeners = [];
            this.errorListeners = [];
            this.preOpenQueue = [];
            this.logger = new Logger("BifrostJsonRpcClient", verbose);
            this.url = url;
            this.connect();
        }
        close() {
            return new Promise(resolve => {
                if (this.ws.readyState === this.ws.CLOSED) {
                    resolve();
                    return;
                }
                this.ws.addEventListener("close", event => resolve(event));
                this.ws.close(1000, "Client session finished");
            });
        }
        onMessage(consumer) {
            this.messageListeners.push(consumer);
        }
        onError(errorListener) {
            this.errorListeners.push(errorListener);
        }
        send(method, params) {
            const id = this.nextRequestId();
            const promise = this.deferredManager.defer(id);
            const req = {
                jsonrpc: "2.0",
                id,
                method,
                params,
            };
            if (this.ws.readyState > 0) {
                this.doSend(req);
            }
            else {
                this.preOpenQueue.push(req);
            }
            return promise;
        }
        connect() {
            this.ws = new WebSocket(this.url);
            this.ws.addEventListener("open", () => {
                this.logger.info("Connected to Bifrost server at %s", this.url);
                this.preOpenQueue.forEach(req => this.doSend(req));
            });
            this.ws.addEventListener("message", (event) => {
                let response;
                try {
                    response = JSON.parse(event.data.toString());
                    this.logger.info("<== Received: %s", JSON.stringify(response, null, 2));
                }
                catch (error) {
                    this.logger.error("Error parsing message as JSON: %O", response);
                    return;
                }
                if (isOk(response)) {
                    if (isAck(response.result)) {
                        this.deferredManager.resolve(response.id, response.result);
                    }
                    else {
                        this.notifyResultListeners(response.result);
                    }
                }
                else {
                    this.notifyErrorListeners(response);
                }
            });
            this.ws.addEventListener("error", (event) => {
                this.logger.error("Connection error: %s", event.message);
            });
            this.ws.addEventListener("close", (event) => {
                if (event.wasClean) {
                    this.logger.info("Connection to bifrost server closed gracefully");
                }
                else {
                    console.dir(event);
                    this.logger.error("Connection to bifrost server lost: code: %s reason: %s", event.code, event.reason);
                    setTimeout(() => this.connect(), 5000);
                }
            });
        }
        doSend(req) {
            this.logger.info("==> Sending: %s", JSON.stringify(req, null, 2));
            this.ws.send(JSON.stringify(req));
        }
        nextRequestId() {
            return this.requestCounter++;
        }
        notifyResultListeners(result) {
            for (const listener of this.messageListeners) {
                listener(result);
            }
        }
        notifyErrorListeners(error) {
            for (const listener of this.errorListeners) {
                listener(error);
            }
        }
    }

    function processResponse(response) {
        if (response.ok) {
            return response.json();
        }
        else {
            return response.text().then(err => Promise.reject({ status: response.status, statusText: response.statusText, body: err }));
        }
    }
    function queryStringify(dto) {
        return Object.entries(dto).reduce((accumulator, [key, value], index) => {
            let processedVal;
            if (value instanceof Object) {
                processedVal = encodeURIComponent(JSON.stringify(value));
            }
            else {
                processedVal = value;
            }
            return `${accumulator}${index === 0 ? "?" : "&"}${key}=${processedVal}`;
        }, "");
    }

    class BifrostRestClient {
        constructor(url) {
            this.url = url;
        }
        async getLines(params) {
            return await this.request(params);
        }
        async request(params) {
            const resp = await fetch(`${this.url}${queryStringify(params)}`);
            return await processResponse(resp);
        }
    }

    class BifrostClient {
        constructor(host, verbose = false) {
            this.subscriptionStore = {};
            this.host = host;
            this.rpcClient = new BifrostJsonRpcClient(`ws://${this.host}/socket`, verbose);
            this.rpcClient.onMessage(result => this.onReceiveResult(result));
            this.restClient = new BifrostRestClient(`http://${this.host}/`);
        }
        close() {
            return this.rpcClient.close();
        }
        getLines(params) {
            return this.restClient.getLines(params);
        }
        async subscribe(subscribe, consumer) {
            const resp = await this.rpcClient.send("SUBSCRIBE", subscribe);
            this.subscriptionStore[resp.value] = consumer;
            return resp.value;
        }
        onReceiveResult(result) {
            if (isLineResult(result)) {
                const handle = this.subscriptionStore[result.value.subscriptionTopic];
                if (!handle) {
                    return;
                }
                handle(result.value);
            }
        }
    }

    const template$1 = document.createElement("template");
    template$1.innerHTML = `
<log-viewer></log-viewer>
`;
    class BifrostLogViewer extends HTMLElement {
        constructor(bifrostHost, subscriptionParams) {
            super();
            this.topLine = null;
            this.bifrostHost = bifrostHost;
            this.subscriptionParams = subscriptionParams;
            this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template$1.content.cloneNode(true));
        }
        disconnect() {
            this.client.close();
        }
        connectedCallback() {
            this.client = new BifrostClient(this.bifrostHost);
            this.logViewer = this.shadowRoot.querySelector("log-viewer");
            this.init();
            this.logViewer.addEventListener("onLoadMore", () => this.loadMore());
        }
        disconnectedCallback() {
            this.disconnect();
        }
        init() {
            this.client.subscribe(this.subscriptionParams, line => {
                if (this.topLine === null) {
                    this.topLine = line;
                }
                this.logViewer.appendLine(`[${line.timestamp}] ${line.message}`);
            });
        }
        async loadMore() {
            if (this.topLine && this.topLine.last) {
                console.info("No further lines to load");
                return;
            }
            const req = {
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
            }
            catch (e) {
                console.error(`Error fetching lines: ${e.message}`);
            }
            this.logViewer.prependLines(lines);
        }
    }
    customElements.define("bifrost-log-viewer", BifrostLogViewer);

    class BifrostLogViewerController {
        constructor($element) {
            this.$element = $element;
            this.$postLink = this.$postLink.bind(this);
        }

        $postLink() {
            const bifrostElem = new BifrostLogViewer(this.bifrostHost, { prefixFilters: this.prefixFilters, matchFilters: this.matchFilters });
            this.$element.append(bifrostElem);
        }
    }

    BifrostLogViewerController.$inject = ["$element"];

    var BifrostLogViewerComponent = {
        controller: BifrostLogViewerController,
        bindings: {
            bifrostHost: "<",
            matchFilters: "<",
            prefixFilters: "<"
        }
    };

    angular.module("bifrost", [])
           .component("ngBifrostLogViewer", BifrostLogViewerComponent);

    const bifrost = {
        client: BifrostClient,
        BifrostLogViewer,
        LogViewer
    };

    return bifrost;

})));
