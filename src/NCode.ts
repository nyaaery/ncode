import { Segment, ParseSegmentsValue, parse_segments } from "./parse_segments";

export interface Data {
    [key: string]: number | bigint
}

export class NCode<T extends Data> {

    readonly size: number;
    readonly #segments: Segment[];

    constructor(...parameters: any[]) {
        const value: ParseSegmentsValue = parse_segments(parameters, false);

        this.size = value.size;
        this.#segments = value.segments;
    }

    encode(data: T): number {
        const _data: any = data as any; /* We need to cast data as any
                                           to allow us to index with symbols
                                        */

        let n: number = 0;
        let offset: number = this.size;

        /*
            Loop thru each segment and add its data value bitshifted by its offset in the number
        */
        for (const segment of this.#segments) {
            const symbol: string | symbol = segment.symbol;
            const big: boolean = segment.big;
            const size: number = segment.size;
            
            offset -= size;
        /*  ^^^^^^^^^^^^^^
            We loop thru the segments highest to lowest
            So we should reduce the offset as we approach the end of the number
        */

            const value: any = _data[symbol];

            switch (typeof value) {
                case "number":
                    // Type guard and overflow guard
                    if (big) {
                        throw new Error(`${symbol.toString()} must be bigint`);
                    }
                    if (value >= 2 ** size) {
                        throw new Error(`${symbol.toString()} exceeds size ${size} bits`);
                    }

                    n += value << offset;
                    break;
                case "bigint":
                    // Type guard and overflow guard
                    if (!big) {
                        throw new Error(`${symbol.toString()} must be number`);
                    }
                    if (value >= 2n ** BigInt(size)) {
                        throw new Error(`${symbol.toString()} exceeds size ${size} bits`);
                    }

                    n += parseInt(value.toString()) << offset;
                    break;
                default:
                    throw new Error(`${symbol.toString()} must be ${big ? "bigint" : "number"}`);
            }
        }

        return n;
    }
    
    decode(n: number): T {
        /*
            Attempting to decode an oversized number will not break the code
            However, it could mean there is a bug in the calling code
            so we should throw an error
        */
        if (n >= 2 ** this.size) {
            throw new Error(`Number exceeds size ${this.size} bits`);
        }

        const data: any = {};

        let offset: number = this.size;
        
        /*
            Loop thru each segment and extract its value from the number
            by bitshifting by its offset in the number
            then masking by its size
        */
        for (const segment of this.#segments) {
            const symbol: string | symbol = segment.symbol;
            const big: boolean = segment.big;
            const size: number = segment.size;
            
            offset -= size;
        /*  ^^^^^^^^^^^^^^
            We loop thru the segments highest to lowest
            So we should reduce the offset as we approach the end of the number
        */

            const mask: number = 2 ** size - 1; 
            const value: number = n >> offset & mask;

            data[symbol] = big ? BigInt(value) : value;
        }

        return data;
    }

}