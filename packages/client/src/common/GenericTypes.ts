export type Consumer<T> = (param: T) => void;

export type BiConsumer<T, K> = (paramT: T, paramK: K) => void;
