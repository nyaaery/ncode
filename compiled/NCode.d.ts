export interface Data {
    [key: string]: number | bigint;
}
export declare class NCode<T extends Data> {
    #private;
    readonly size: number;
    constructor(...parameters: any[]);
    encode(data: T): number;
    decode(n: number): T;
}
