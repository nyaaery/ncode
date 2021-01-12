import { Data } from "./NCode";
export declare class NCodeBig<T extends Data> {
    #private;
    readonly size: number;
    constructor(...parameters: any[]);
    encode(data: T): bigint;
    decode(n: bigint): T;
}
