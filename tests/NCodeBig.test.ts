import { NCodeBig } from "../src/NCodeBig";

describe("Number data", () => {
    /*
        x = 11   y = 22
        00001011 00010110 bin
                     2838 dec
    */ 
    const ncode = new NCodeBig(8, "x", 8, "y");

    const data = {
        x: 11,
        y: 22
    };
    const n: bigint = 2838n;

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

    const ncode = new NCodeBig(8n, "x", 8n, "y");

    const data = {
        x: 33n,
        y: 44n
    };
    const n: bigint = 8492n;

    test(".encode Encodes", () => {
        expect(ncode.encode(data)).toBe(n);
    });

    test(".decode Decodes", () => {
        expect(ncode.decode(n)).toStrictEqual(data);
    });
});

describe("Max size", () => {
    const ncode = new NCodeBig(8, "x", 8, "y");

    test(".encode Throws error if data exceeds max size", () => {
        expect(() => {
            ncode.encode({ x: 256, y: 11 });
        }).toThrow();
    });

    test(".decode Throws error if number exceeds max size", () => {
        expect(() => {
            ncode.decode(65536n);
        }).toThrow();
    });
});