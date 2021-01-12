export interface Segment {
    symbol: string | symbol;
    big: boolean;
    size: number;
}
export interface ParseSegmentsValue {
    size: number;
    segments: Segment[];
}
/**
 * Parses array of parameters into segments
 *
 * @param parameters
 * @param big Is the sum of segments allowed to exceed max size
 */
export declare function parse_segments(parameters: any[], big: boolean): ParseSegmentsValue;
