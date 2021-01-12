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
exports.NCodeBig = void 0;
const parse_segments_1 = require("./parse_segments");
class NCodeBig {
    constructor(...parameters) {
        _segments.set(this, void 0);
        const value = parse_segments_1.parse_segments(parameters, true);
        this.size = value.size;
        __classPrivateFieldSet(this, _segments, value.segments);
    }
    encode(data) {
        // Logic is the same as NCode.encode. See NCode.encode for comments
        const _data = data;
        let n = 0n;
        let offset = BigInt(this.size);
        for (const segment of __classPrivateFieldGet(this, _segments)) {
            const symbol = segment.symbol;
            const big = segment.big;
            const size = segment.size;
            offset -= BigInt(size);
            const value = _data[symbol];
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
    decode(n) {
        // Logic is the same as NCode.decode. See NCode.decode for comments
        if (n >= 2n ** BigInt(this.size)) {
            throw new Error(`Number exceeds size ${this.size} bits`);
        }
        const data = {};
        let offset = BigInt(this.size);
        for (const segment of __classPrivateFieldGet(this, _segments)) {
            const symbol = segment.symbol;
            const big = segment.big;
            const size = segment.size;
            offset -= BigInt(size);
            const mask = 2n ** BigInt(size) - 1n;
            const value = n >> offset & mask;
            data[symbol] = big ? value : parseInt(value.toString());
        }
        return data;
    }
}
exports.NCodeBig = NCodeBig;
_segments = new WeakMap();
