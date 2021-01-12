import { Segment, ParseSegmentsValue, parse_segments } from "./parse_segments";
import { Data } from "./NCode";

export class NCodeBig<T extends Data> {

    readonly size: number;
    readonly #segments: Segment[];

    constructor(...parameters: any[]) {
        const value: ParseSegmentsValue = parse_segments(parameters, true);

        this.size = value.size;
        this.#segments = value.segments;
    }

    encode(data: T): bigint {
        // Logic is the same as NCode.encode. See NCode.encode for comments
        const _data: any = data as any;

        let n: bigint = 0n;
        let offset: bigint = BigInt(this.size);

        for (const segment of this.#segments) {
            const symbol: string | symbol = segment.symbol;
            const big: boolean = segment.big;
            const size: number = segment.size;
            
            offset -= BigInt(size);

            const value: any = _data[symbol];

            switch (typeof value) {
                case "number":
                    if (big) {
                        throw new Error(`${symbol.toString()} must be bigint`);
                    }
                    if (value >= 2 ** size) {
                        throw new Error(`${symbol.toString()} exceeds size ${size} bits`);
                    }

                    n += BigInt(value) << offset;
                    break;
                case "bigint":
                    if (!big) {
                        throw new Error(`${symbol.toString()} must be number`);
                    }
                    if (value >= 2n ** BigInt(size)) {
                        throw new Error(`${symbol.toString()} exceeds size ${size} bits`);
                    }

                    n += value << offset;
                    break;
                default:
                    throw new Error(`${symbol.toString()} must be ${big ? "bigint" : "number"}`);
            }
        }

        return n;
    }

    decode(n: bigint): T {
        // Logic is the same as NCode.decode. See NCode.decode for comments
        if (n >= 2n ** BigInt(this.size)) {
            throw new Error(`Number exceeds size ${this.size} bits`);
        }

        const data: any = {};

        let offset: bigint = BigInt(this.size);
        
        for (const segment of this.#segments) {
            const symbol: string | symbol = segment.symbol;
            const big: boolean = segment.big;
            const size: number = segment.size;
            
            offset -= BigInt(size);

            const mask: bigint = 2n ** BigInt(size) - 1n; 
            const value: bigint = n >> offset & mask;

            data[symbol] = big ? value : parseInt(value.toString());
        }

        return data;
    }

}