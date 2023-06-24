A tiny composable type guard utility library.

[![Build Status](https://img.shields.io/github/actions/workflow/status/Pingid/typeofit/test.yml?branch=main&style=flat&colorA=000000&colorB=000000)](https://github.com/Pingid/typeofit/actions?query=workflow:Test)
[![Build Size](https://img.shields.io/bundlephobia/minzip/typeofit?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=typeofit)
[![Version](https://img.shields.io/npm/v/typeofit?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/typeofit)

```bash
npm install typeofit # or yarn add typeofit or pnpm add typeofit
```

## Usage
```typescript
import * as is from 'typeofit'

const unknown: unknown;

if (is.string(unknown)) // string

if (is.number(unknown)) // number

if (is.array()(unknown)) // unknown[]

if (is.array(is.string)(unknown)) // string[]

if (is.record()(unknown)) // Record<string, any>

if (is.record(is.literal('foo'), is.number)(unknown)) // { foo: number }

if (is.tuple(is.literal('foo'), is.literal(10))(unknown)) // ['foo', 10]

if (is.struct({ foo: is.literal('bar') })(unknown)) // { foo: 'bar' }

if (is.or(is.literal('foo'), is.literal('bar'))(unknown)) // 'foo' | 'bar'

const items: (number | null)[]
const defined = items.filter(is.defined) // number[]
```

## License
MIT © [Dan Beaven](https://github.com/Pingid)