# NodeJS Character Encodings
List of character encodings supported by NodeJS.

## Table of Contents
1. [Why?](#why)
1. [Installation](#installation)
1. [Examples](#examples)

## Why?
**TL;DR**: `iconv-lite` is significantly slower when decoding natively supported character encodings in NodeJS. Hence, a map of encodings for which `iconv-lite` (and other similar modules) can be bypassed is useful.

Whilst building [utilities](https://github.com/haliaeetus/scrape-util) to help in various web scraping projects, I was using the excellent [request module](https://www.npmjs.com/package/request) to retrieve HTML.

One source page was encoded using ISO-8859-1 (latin1), which was unsupported by `request`, resulting in the dreaded � character when I tried to decode using utf-8.

So after some googling, I discovered the comprehensive & speedy [iconv-lite module](https://www.npmjs.com/package/iconv-lite), which would enable me to decode a whole host more types of character encodings.

However, I discovered that for natively supported encodings, `iconv-lite` took substantially more time.

```
// utf-8
native: 1.372ms
iconv: 12.375ms

// latin1
native: 0.059ms
iconv: 14.090ms
```

When I discovered that there was no official list of natively supported encodings, it seemed reasonable to publish a module to provide that information, albeit a simple one.

N.b. In so doing, I also discovered that while `request` doesn't support `latin1`, Node has supported it natively since [6.4.0](https://github.com/nodejs/node/blob/master/doc/changelogs/CHANGELOG_V6.md#6.4.0).

## Installation
```
npm install --save encodings
```

## Examples
```
var encodings = require('encodings');

console.log(encodings.utf8); // => true
console.log(encodings['phoenix']); // => undefined

// Prior to 6.4.0
console.log(encodings.latin1); // => undefined

// 6.4.0 onwards
console.log(encodings.latin1); // => true
```
