export class Logger {
    private prefix: string;
    private verbose: boolean;

    constructor(prefix: string = "", verbose: boolean = false) {
        this.prefix = prefix;
        this.verbose = verbose;
    }

    public log(level: "debug" | "info" | "warn" | "error" , message: string, ...params: any): void {
        if (!this.verbose && level !== "error") {
            return;
        }

        const prefixed: string = `[${this.prefix}] ${message}`;
        console[level](prefixed, ...params);
    }

    public error(message: string, ...params: any): void {
        this.log("error", message, ...params);
    }

    public warn(message: string, ...params: any): void {
        this.log("warn", message, ...params);
    }

    public info(message: string, ...params: any): void {
        this.log("info", message, ...params);
    }

    public debug(message: string, ...params: any): void {
        this.log("debug", message, ...params);
    }
}
