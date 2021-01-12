"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _segments;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NCode = void 0;
const parse_segments_1 = require("./parse_segments");
class NCode {
    constructor(...parameters) {
        _segments.set(this, void 0);
        const value = parse_segments_1.parse_segments(parameters, false);
        this.size = value.size;
        __classPrivateFieldSet(this, _segments, value.segments);
    }
    encode(data) {
        const _data = data; /* We need to cast data as any
                                           to allow us to index with symbols
                                        */
        let n = 0;
        let offset = this.size;
        /*
            Loop thru each segment and add its data value bitshifted by its offset in the number
        */
        for (const segment of __classPrivateFieldGet(this, _segments)) {
            const symbol = segment.symbol;
            const big = segment.big;
            const size = segment.size;
            offset -= size;
            /*  ^^^^^^^^^^^^^^
                We loop thru the segments highest to lowest
                So we should reduce the offset as we approach the end of the number
            */
            const value = _data[symbol];
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
    decode(n) {
        /*
            Attempting to decode an oversized number will not break the code
            However, it could mean there is a bug in the calling code
            so we should throw an error
        */
        if (n >= 2 ** this.size) {
            throw new Error(`Number exceeds size ${this.size} bits`);
        }
        const data = {};
        let offset = this.size;
        /*
            Loop thru each segment and extract its value from the number
            by bitshifting by its offset in the number
            then masking by its size
        */
        for (const segment of __classPrivateFieldGet(this, _segments)) {
            const symbol = segment.symbol;
            const big = segment.big;
            const size = segment.size;
            offset -= size;
            /*  ^^^^^^^^^^^^^^
                We loop thru the segments highest to lowest
                So we should reduce the offset as we approach the end of the number
            */
            const mask = 2 ** size - 1;
            const value = n >> offset & mask;
            data[symbol] = big ? BigInt(value) : value;
        }
        return data;
    }
}
exports.NCode = NCode;
_segments = new WeakMap();
