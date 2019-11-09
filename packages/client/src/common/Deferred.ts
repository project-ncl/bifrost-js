import { Consumer } from "./GenericTypes";

export class Deferred<T> {
    public promise: Promise<T>;
    public resolve: Consumer<T>;
    public reject: Consumer<any>;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}
