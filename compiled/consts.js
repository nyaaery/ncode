"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.max_size = void 0;
exports.max_size = Math.log2(Number.MAX_SAFE_INTEGER);
/*                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                53

                                Supposed to be floor(log2(n)) + 1
                                But JavaScript numbers aren't precise enough to have decimals at this size
                                So log2(n) won't floor
                                So + 1 makes it 1 too large
*/ 
