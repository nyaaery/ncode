"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse_segments = void 0;
const consts_1 = require("./consts");
/**
 * Parses array of parameters into segments
 *
 * @param parameters
 * @param big Is the sum of segments allowed to exceed max size
 */
function parse_segments(parameters, big) {
    if (parameters.length % 2 != 0) {
        throw new Error("Malformed parameters");
    }
    let segments = [];
    let size = 0;
    /*
        Loop thru two parameters at a time and push new segments where
        the first parameter is the segment's size and type
        and the second parameter is the segment's symbol/name
    */
    for (let i = 0; i < parameters.length; i += 2) {
        const size_p = parameters[i];
        const symbol_p = parameters[i + 1];
        let segment_big = false;
        let segment_size = 0;
        switch (typeof size_p) {
            case "number":
                // If the size's type is number then the segment's type is also number
                segment_big = false;
                segment_size = size_p;
                // Type guard
                if (segment_size < 0 || segment_size % 1 != 0) {
                    throw new Error("Size must be a nonnegative integer");
                }
                break;
            case "bigint":
                // If the size's type is bigint then the segment's type is also bigint
                segment_big = true;
                segment_size = parseInt(size_p.toString());
                // Type guard
                if (segment_size < 0) {
                    throw new Error("Size must be a nonnegative integer");
                }
                break;
            // Type guard
            default:
                throw new Error("Size must be a nonnegative integer");
        }
        switch (typeof symbol_p) {
            case "string":
            case "symbol":
                // Push the new segment with the second parameter as symbol/name
                segments.push({
                    symbol: symbol_p,
                    big: segment_big,
                    size: segment_size
                });
                size += segment_size; // Add the segment's size to the total size
                break;
            // Type guard
            default:
                throw new Error("Symbol must be either string or symbol");
        }
    }
    // Overflow guard
    if (size > consts_1.max_size && !big) {
        throw new Error("Size exceeds max size");
    }
    return {
        size,
        segments
    };
}
exports.parse_segments = parse_segments;
