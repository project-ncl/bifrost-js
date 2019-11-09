import { Deferred } from "./Deferred";

export class DeferredManager<K, V> {
    private deferreds: Map<K, Deferred<V>> = new Map();

    public defer(key: K): Promise<V> {
        const deffered: Deferred<V> = new Deferred();
        this.deferreds.set(key, deffered);
        return deffered.promise;
    }

    public resolve(key: K, value: V): void {
        this.getAndRemoveIfExists(key).resolve(value);
    }

    public reject(key: K, reason: any) {
        this.getAndRemoveIfExists(key).reject(reason);
    }

    private getIfExists(key: K): Deferred<V> {
        if (!this.deferreds.has(key)) {
            throw new Error(`No deferred value exists for key: ${key}`);
        }

        return this.deferreds.get(key);
    }

    private getAndRemoveIfExists(key: K): Deferred<V> {
        const deferred = this.getIfExists(key);
        this.deferreds.delete(key);
        return deferred;
    }
}
