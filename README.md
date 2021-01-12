# NCode
## Installing
```
npm i git+https://github.com/nyaaery/ncode.git
```
## < 54 bits
floor(log₂(Number.MAX_SAFE_INTEGER)) + 1 = 53
```ts
const z: symbol = Symbol();

const ncode = new NCode(16, "x", 16n, "y", 16, z);

ncode.encode({ x: 12, y: 24n, [z]: 48 });
/*
    51541180464

              x = 12          y = 24n         [z] = 48
    0000000000001100 0000000000011000 0000000000110000 bin
                                           51541180464 dec
*/

ncode.decode(51541180464);
/*
    {
        x: 12,
        y: 24n,
        [Symbol()]: 48
    }
*/
```
## Big
```ts
const z: symbol = Symbol();

const ncode = new NCodeBig(32, "x", 32n, "y", 32, z);

ncode.encode({ x: 144, y: 288n, [z]: 576 });
/*
    2656331147851126014528n

                             x = 144                         y = 288n                        [z] = 576
    00000000000000000000000010010000 00000000000000000000000100100000 00000000000000000000001001000000 bin
                                                                                2656331147851126014528 dec
*/

ncode.decode(2656331147851126014528n);
/*
    {
        x: 144,
        y: 288n,
        [Symbol()]: 576
    }
*/
```