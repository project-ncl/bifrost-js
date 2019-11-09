export function processResponse<T>(response: Response): Promise<T> {
    if (response.ok) {
        return response.json();
    } else {
        return response.text().then(err => Promise.reject({ status: response.status, statusText: response.statusText, body: err }));
    }
}

export function queryStringify(dto: any): string {
    return Object.entries(dto).reduce((accumulator, [key, value]: [string, any], index) => {
        let processedVal: string;

        if (value instanceof Object) {
            processedVal = encodeURIComponent(JSON.stringify(value));
        } else {
            processedVal = value;
        }

        return `${accumulator}${index === 0 ? "?" : "&"}${key}=${processedVal}`;
    }, "");
}
