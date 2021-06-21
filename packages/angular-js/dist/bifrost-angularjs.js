/*! v0.1.4 @project-ncl/bifrost-angular-js 2021-06-21 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).bifrost=t()}(this,function(){"use strict";class e{constructor(e){this.MAX_FLUSH_SIZE=25,this.appendBuffer=[],this.prependBuffer=[],this.scheduled=!1,this.containerElement=e}queueAppend(e){this.schedule(),this.appendBuffer.push(e)}queuePrepend(e){this.schedule(),this.prependBuffer.push(e)}onPostFlush(e){this.postFlushCb=e}schedule(){this.scheduled||(this.scheduled=!0,window.requestAnimationFrame(()=>{this.flushAppendBuffer(),this.postFlushCb&&this.postFlushCb(),this.flushPrependBuffer(),this.scheduled=!1}))}flushAppendBuffer(){0<this.appendBuffer.length&&this.containerElement.append(this.doFlush(this.appendBuffer))}flushPrependBuffer(){0<this.prependBuffer.length&&this.containerElement.prepend(this.doFlush(this.prependBuffer))}doFlush(t){const s=new DocumentFragment;for(let e=0;0<this.appendBuffer.length&&e<this.MAX_FLUSH_SIZE;e++)s.appendChild(t.shift());return s}}const t=document.createElement("template");t.innerHTML=`
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
    </div>
    <div class="content"></div>
    <span id="end"></span>
</div>
`;class s extends HTMLElement{constructor(){super(),this.follow=!1;const e=this.attachShadow({mode:"open"});e.appendChild(t.content.cloneNode(!0))}connectedCallback(){this.logContainer=this.$(".content"),this.buffer=new e(this.logContainer),this.buffer.onPostFlush(()=>this.doFollowLog()),this.$("#btn-go-bottom").addEventListener("click",()=>this.scrollToBottom()),this.$("#btn-go-top").addEventListener("click",()=>this.scrollToTop()),this.$("#btn-toggle-follow").addEventListener("click",()=>this.toggleFollow())}appendLine(e){this.buffer.queueAppend(this.createLineElement(e))}appendLines(e){this.logContainer.appendChild(this.createFragment(e))}prependLine(e){this.logContainer.prepend(this.createLineElement(e))}prependLines(e){this.logContainer.prepend(this.createFragment(e))}scrollToBottom(){this.$("#end").scrollIntoView()}scrollToTop(){this.follow=!1,this.$("#top").scrollIntoView()}toggleFollow(){this.follow||this.scrollToBottom(),this.follow=!this.follow}$(e){return this.shadowRoot&&this.shadowRoot.querySelector(e)}createLineElement(e){const t=document.createElement("div");return e.includes("ERROR")?t.setAttribute("class","line error"):e.includes("WARN")?t.setAttribute("class","line warn"):t.setAttribute("class","line"),t.appendChild(document.createTextNode(e)),t}createFragment(e){const t=document.createDocumentFragment();return e.forEach(e=>{e=this.createLineElement(e),t.appendChild(e)}),t}doFollowLog(){this.follow&&this.scrollToBottom()}}customElements.define("log-viewer",s);class o{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}class r{constructor(){this.deferreds=new Map}defer(e){var t=new o;return this.deferreds.set(e,t),t.promise}resolve(e,t){this.getAndRemoveIfExists(e).resolve(t)}reject(e,t){this.getAndRemoveIfExists(e).reject(t)}getIfExists(e){if(!this.deferreds.has(e))throw new Error(`No deferred value exists for key: ${e}`);return this.deferreds.get(e)}getAndRemoveIfExists(e){var t=this.getIfExists(e);return this.deferreds.delete(e),t}}class i{constructor(e="",t=!1){this.prefix=e,this.verbose=t}log(e,t,...s){!this.verbose&&"error"!==e||(t=`[${this.prefix}] ${t}`,console[e](t,...s))}error(e,...t){this.log("error",e,...t)}warn(e,...t){this.log("warn",e,...t)}info(e,...t){this.log("info",e,...t)}debug(e,...t){this.log("debug",e,...t)}}class n{constructor(e,t=!1){this.requestCounter=0,this.deferredManager=new r,this.messageListeners=[],this.errorListeners=[],this.preOpenQueue=[],this.logger=new i("BifrostJsonRpcClient",t),this.url=e,this.connect()}close(){return new Promise(t=>{this.ws.readyState!==this.ws.CLOSED?(this.ws.addEventListener("close",e=>t(e)),this.ws.close(1e3,"Client session finished")):t()})}onMessage(e){this.messageListeners.push(e)}onError(e){this.errorListeners.push(e)}send(e,t){var s=this.nextRequestId(),o=this.deferredManager.defer(s),t={jsonrpc:"2.0",id:s,method:e,params:t};return 0<this.ws.readyState?this.doSend(t):this.preOpenQueue.push(t),o}connect(){this.ws=new WebSocket(this.url),this.ws.addEventListener("open",()=>{this.logger.info("Connected to Bifrost server at %s",this.url),this.preOpenQueue.forEach(e=>this.doSend(e))}),this.ws.addEventListener("message",e=>{let t;try{t=JSON.parse(e.data.toString()),this.logger.info("<== Received: %s",JSON.stringify(t,null,2))}catch(e){return void this.logger.error("Error parsing message as JSON: %O",t)}var s;void 0!==t.result?"org.jboss.pnc.bifrost.endpoint.websocket.OkResult"===(s=t.result).type||"org.jboss.pnc.bifrost.endpoint.websocket.SubscribeResultDto"===s.type?this.deferredManager.resolve(t.id,t.result):this.notifyResultListeners(t.result):this.notifyErrorListeners(t)}),this.ws.addEventListener("error",e=>{this.logger.error("Connection error: %s",e.message)}),this.ws.addEventListener("close",e=>{e.wasClean?this.logger.info("Connection to bifrost server closed gracefully"):(console.dir(e),this.logger.error("Connection to bifrost server lost: code: %s reason: %s",e.code,e.reason),setTimeout(()=>this.connect(),5e3))})}doSend(e){this.logger.info("==> Sending: %s",JSON.stringify(e,null,2)),this.ws.send(JSON.stringify(e))}nextRequestId(){return this.requestCounter++}notifyResultListeners(e){for(const t of this.messageListeners)t(e)}notifyErrorListeners(e){for(const t of this.errorListeners)t(e)}}class l{constructor(e){this.url=e}async getLines(e){return this.request(e)}async request(e){var t,s;return e=await fetch(`${this.url}${t=e,Object.entries(t).reduce((e,[t,s],o)=>{return`${e}${0===o?"?":"&"}${t}=${s instanceof Object?encodeURIComponent(JSON.stringify(s)):s}`},"")}`),(s=e).ok?s.json():s.text().then(e=>Promise.reject({status:s.status,statusText:s.statusText,body:e}))}}class c{constructor(e,t=!1){this.subscriptionStore={},this.host=e,this.rpcClient=new n(`wss://${this.host}/socket`,t),this.rpcClient.onMessage(e=>this.onReceiveResult(e)),this.restClient=new l(`https://${this.host}/`)}close(){return this.rpcClient.close()}getLines(e){return this.restClient.getLines(e)}async subscribe(e,t){return e=await this.rpcClient.send("SUBSCRIBE",e),this.subscriptionStore[e.value]=t,e.value}onReceiveResult(e){if("org.jboss.pnc.bifrost.endpoint.websocket.LineResult"===e.type){const t=this.subscriptionStore[e.value.subscriptionTopic];t&&t(e.value)}}}const h=document.createElement("template");h.innerHTML=`
<log-viewer></log-viewer>
`;class a extends HTMLElement{constructor(e,t){super(),this.topLine=null,this.bifrostHost=e,this.subscriptionParams=t,this.attachShadow({mode:"open"}),this.shadowRoot.appendChild(h.content.cloneNode(!0))}disconnect(){this.client.close()}connectedCallback(){this.client=new c(this.bifrostHost),this.logViewer=this.shadowRoot.querySelector("log-viewer"),this.init(),this.logViewer.addEventListener("onLoadMore",()=>this.loadMore())}disconnectedCallback(){this.disconnect()}init(){this.client.subscribe(this.subscriptionParams,e=>{null===this.topLine&&(this.topLine=e),this.logViewer.appendLine(`[${e.timestamp}] ${e.message}`),e.stackTrace&&this.logViewer.appendLine(`Stack Trace: ${e.stackTrace}`)})}async loadMore(){if(this.topLine&&this.topLine.last)console.info("No further lines to load");else{const t={...this.subscriptionParams,direction:"DESC",maxLines:50};this.topLine&&(t.afterLine=this.topLine);let e;try{const s=await this.client.getLines(t);e=s.map(e=>`[${e.timestamp}] ${e.message}`),this.topLine=s[0]}catch(e){console.error(`Error fetching lines: ${e.message}`)}this.logViewer.prependLines(e)}}}customElements.define("bifrost-log-viewer",a);class d{constructor(e){this.$element=e,this.$postLink=this.$postLink.bind(this)}$postLink(){var e=new a(this.bifrostHost,{prefixFilters:this.prefixFilters,matchFilters:this.matchFilters});this.$element.append(e)}}d.$inject=["$element"];var u={controller:d,bindings:{bifrostHost:"<",matchFilters:"<",prefixFilters:"<"}};return angular.module("bifrost",[]).component("ngBifrostLogViewer",u),{client:c,BifrostLogViewer:a,LogViewer:s}});