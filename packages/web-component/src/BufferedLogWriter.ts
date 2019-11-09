export class BufferedLogWriter {

    private appendBuffer: Node[] = [];
    private prependBuffer: Node[] = [];

    private containerElement: ParentNode;

    private scheduled: boolean = false;

    constructor(containerElement: ParentNode) {
        this.containerElement = containerElement;

    }

    public queueAppend(node: Node): void {
        this.schedule();
        this.appendBuffer.push(node);
    }

    public queuePrepend(node: Node): void {
        this.schedule();
        this.prependBuffer.push(node);
    }

    private schedule(): void {
        if (this.scheduled) {
            return;
        }

        this.scheduled = true;
        window.requestAnimationFrame(() => {
            this.flushAppendBuffer();
            this.flushPrependBuffer();
            this.scheduled = false;
        });
    }

    private flushAppendBuffer(): void {
        while (this.appendBuffer.length > 0) {
            this.containerElement.append(this.appendBuffer.shift());
        }
    }

    private flushPrependBuffer(): void {
        while (this.prependBuffer.length > 0) {
            this.containerElement.prepend(this.prependBuffer.shift());
        }
    }


}
