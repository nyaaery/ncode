import { NCode } from "../src/NCode";
import { max_size } from "../src/consts";

describe("Number data", () => {
    /*
        x = 11   y = 22
        00001011 00010110 bin
                     2838 dec
    */
    const ncode = new NCode(8, "x", 8, "y");

    const data = {
        x: 11,
        y: 22
    };
    const n: number = 2838;

    test(".encode Encodes", () => {
        expect(ncode.encode(data)).toBe(n);
    });

    test(".decode Decodes", () => {
        expect(ncode.decode(n)).toStrictEqual(data);
    });
});

describe("BigInt data", () => {
    /*
        x = 33   y = 44
        00100001 00101100 bin
                     8492 dec
    */
    const ncode = new NCode(8n, "x", 8n, "y");

    const data = {
        x: 33n,
        y: 44n
    };
    const n: number = 8492;

    test(".encode Encodes", () => {
        expect(ncode.encode(data)).toBe(n);
    });

    test(".decode Decodes", () => {
        expect(ncode.decode(n)).toStrictEqual(data);
    });
});

test("Throws error if size exceeds max size", () => {
    expect(() => {
        new NCode(max_size, "x", 1, "y");
    }).toThrow();
});

describe("Max size", () => {
    const ncode = new NCode(8, "x", 8, "y");

    test(".encode Throws error if data exceeds max size", () => {
        expect(() => {
            ncode.encode({ x: 256, y: 11 });
        }).toThrow();
    });

    test(".decode Throws error if number exceeds max size", () => {
        expect(() => {
            ncode.decode(65536);
        }).toThrow();
    });
});