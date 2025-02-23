# bcrypt-ts

[![npm](https://img.shields.io/npm/v/bcrypt-ts?color=%23ff00dd)](https://www.npmjs.com/package/bcrypt-ts)
[![npm downloads](https://img.shields.io/npm/dw/bcrypt-ts)](https://www.npmjs.com/package/bcrypt-ts)
[![types](https://img.shields.io/npm/types/bcrypt-ts)](https://mister-hope.github.io/bcrypt-ts/)

[![Test](https://github.com/Mister-Hope/bcrypt-ts/actions/workflows/test.yml/badge.svg)](https://github.com/Mister-Hope/bcrypt-ts/actions/workflows/test.yml)
[![DeepScan grade](https://deepscan.io/api/teams/15982/projects/28024/branches/898932/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=15982&pid=28024&bid=898932) [![codecov](https://codecov.io/gh/Mister-Hope/bcrypt-ts/graph/badge.svg?token=oO5gZq2aHe)](https://codecov.io/gh/Mister-Hope/bcrypt-ts)

Optimized bcrypt in TypeSCript with zero dependencies. Compatible to the C++ [bcrypt](https://npmjs.org/package/bcrypt) binding on Node.js and also working in the browser.

## Why bcrypt-ts instead of bycrypt.js

- Bcrypt-ts is fully written in TypeScript
- Bcrypt-ts provide dual ESM/cjs mode for both node and browser env, and you can directly
- Minified output
- Tree shakable

## Security considerations

Besides incorporating a salt to protect against rainbow table attacks, bcrypt is an adaptive function: over time, the
iteration count can be increased to make it slower, so it remains resistant to brute-force search attacks even with
increasing computation power. ([see](http://en.wikipedia.org/wiki/Bcrypt))

While bcrypt-ts is compatible to the C++ bcrypt binding, it is built by pure JavaScript and thus slower ([about 30%](https://github.com/dcodeIO/bcrypt.js/wiki/Benchmark)), effectively reducing the number of iterations that can be processed in an equal time span.

The maximum input length is 72 bytes (note that UTF-8 encoded characters use up to 4 bytes) and the length of generated
hashes is 60 characters. Note that maximum input length is not implicitly checked by the library for compatibility with
the C++ binding on Node.js, but should be checked with `truncates(password)` where necessary.

## Install

### Node.js

Install the package:

```bash
npm install bcrypt-ts
```

### CDN

jsDelivr:

- `https://cdn.jsdelivr.net/npm/bcrypt-ts/dist/browser.mjs` (ESM)
- `https://cdn.jsdelivr.net/npm/bcrypt-ts/dist/browser.umd.js` (UMD)

unpkg:

- `https://unpkg.com/bcrypt-ts/dist/browser.mjs` (ESM)
- `https://unpkg.com/n/bcrypt-ts/dist/browser.umd.js` (UMD)

## Usage

On Node.js, the inbuilt [crypto module](http://nodejs.org/api/crypto.html)'s randomBytes interface is used to obtain secure random numbers.

### Browser

In the browser, bcrypt.js relies on [Web Crypto API](http://www.w3.org/TR/WebCryptoAPI)'s getRandomValues interface to obtain secure random numbers. If no cryptographically secure source of randomness is available, the package will **throw an error**.

### How to choose between them

- If you are using this package in pure Node.js environment, then you will probably use the node bundle.

- If you are using bundler like webpack and vite, then you will probably use the browser bundle.

- If you meet any issues that a incorrect bundle is used, you can use `bcrypt-ts/node` and `bcrypt-ts/browser` to force the correct bundle.

### Usage - Sync

To hash a password:

```ts
import { genSaltSync, hashSync } from "bcrypt-ts";

const salt = genSaltSync(10);
const result = hashSync("B4c0//", salt);
// Store hash in your password DB
```

To check a password:

```ts
import { compareSync } from "bcrypt-ts";

// Load hash from your password DB
const hash = "xxx";

compareSync("B4c0//", hash); // true
compareSync("not_bacon", hash); // false
```

Auto-gen a salt and hash at the same time:

```ts
import { hashSync } from "bcrypt-ts";

const result = hashSync("bacon", 8);
```

### Usage - Async

To hash a password:

```ts
import { genSalt, hash } from "bcrypt-ts";

const salt = await genSalt(10);
const result = await hash("B4c0//", salt);
// Store hash in your password DB
```

To check a password:

```ts
import { compare } from "bcrypt-ts";

// Load hash from your password DB
const hash = "xxxxxx";

await bcrypt.compare("B4c0//", hash); // true
await bcrypt.compare("not_bacon", hash); // false
```

Auto-gen a salt and hash:

```ts
import { hash } from "bcrypt-ts";

const result = await bcrypt.hash("B4c0//", 10);
// Store hash in your password DB
```

**Note:** Under the hood, asynchronous APIs split an operation into small chunks. After the completion of a chunk, the execution of the next chunk is placed on the back of the [JS event queue](https://developer.mozilla.org/en/docs/Web/JavaScript/EventLoop), efficiently yielding for other computation to execute.

### Usage - Command Line

```

Usage: bcrypt <input> [rounds|salt]

```

## API

```ts
/**
 * Synchronously tests a string against a hash.
 *
 * @param content String to compare
 * @param hash Hash to test against
 */
export const compareSync: (content: string, hash: string) => boolean;
/**
 * Asynchronously compares the given data against the given hash.
 *
 * @param content Data to compare
 * @param hash Data to be compared to
 * @param progressCallback Callback successively called with the percentage of rounds completed
 *  (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.
 */
export const compare: (
  content: string,
  hash: string,
  progressCallback?: ((percent: number) => void) | undefined,
) => Promise<boolean>;

/**
 * Synchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use, default to 10
 * @returns Resulting hash
 */
export const hashSync: (
  contentString: string,
  salt?: string | number,
) => string;
/**
 * Asynchronously generates a hash for the given string.
 *
 * @param contentString String to hash
 * @param salt Salt length to generate or salt to use
 * @param progressCallback Callback successively called with the percentage of rounds completed
 *  (0.0 - 1.0), maximally once per `MAX_EXECUTION_TIME = 100` ms.
 */
export const hash: (
  contentString: string,
  salt: number | string,
  progressCallback?: ((progress: number) => void) | undefined,
) => Promise<string>;

/**
 * Gets the number of rounds used to encrypt the specified hash.
 *
 * @param hash Hash to extract the used number of rounds from
 * @returns Number of rounds used
 * @throws {Error} If `hash` is not a string
 */
export const getRounds: (hash: string) => number;
/**
 * Gets the salt portion from a hash. Does not validate the hash.
 *
 * @param hash Hash to extract the salt from
 * @returns Extracted salt part
 * @throws {Error} If `hash` is not a string or otherwise invalid
 */
export const getSalt: (hash: string) => string;

/**
 * Synchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 * @returns Resulting salt
 * @throws {Error} If a random fallback is required but not set
 */
export const genSaltSync: (rounds?: number) => string;
/**
 * Asynchronously generates a salt.
 *
 * @param rounds Number of rounds to use, defaults to 10 if omitted
 */
export const genSalt: (rounds?: number) => Promise<string>;
```

## Credits

- Based on [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)

  - Based on work started by Shane Girish at [bcrypt-nodejs](https://github.com/shaneGirish/bcrypt-nodejs)
    - Based on [javascript-bcrypt](http://code.google.com/p/javascript-bcrypt/) (New BSD-licensed).
