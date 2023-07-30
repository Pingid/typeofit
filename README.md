# TypeScript Type Guards Library
This is a TypeScript library that provides a set of utility functions for type guarding. Type guarding allows you to perform runtime checks on values to determine if they satisfy certain conditions. The library offers various functions to check and validate types, create literal type guards, validate arrays and tuples, and more.

[![Build Status](https://img.shields.io/github/actions/workflow/status/Pingid/typeofit/test.yml?branch=main&style=flat&colorA=000000&colorB=000000)](https://github.com/Pingid/typeofit/actions?query=workflow:Test)
[![Build Size](https://img.shields.io/bundlephobia/minzip/typeofit?label=bundle%20size&style=flat&colorA=000000&colorB=000000)](https://bundlephobia.com/result?p=typeofit)
[![Version](https://img.shields.io/npm/v/typeofit?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/typeofit)

```bash
npm install typeofit
```
## API Reference
- [`string`](#string)
- [`object`](#object)
- [`number`](#number)
- [`undef`](#undef)
- [`func`](#func)
- [`nul`](#nul)
- [`literal<T extends any>(of: T)`](#literalconst-t-extends-anyof-t)
- [`array<T = any>(of?: Guard<T>)`](#arrayt--anyof-guardt)
- [`tuple<T extends Guard<any>[]>(...of: T)`](#tuplet-extends-guardanyof-t)
- [`record<K extends string = string, V = any>(key?: Guard<K>, value?: Guard<V>)`](#recordk-extends-string--string-v--anykey-guardk-value-guardv)
- [`struct<T extends Record<any, Guard<any>>>(of: T, strict: boolean = true)`](#structt-extends-recordany-guardanyof-strict-boolean--true)
- [`defined<T>(x: T | undefined | null): x is T`](#definedtx-t--undefined--null-x-is-t)
- [`or<T extends Guard<any>[]>(...of: T)`](#ort-extends-guardanyof-t)
- [`is<T extends V, V = unknown>(cb: (x: V) => boolean): Guard<T, V>`](#ist-extends-v-v--unknowncb-x-v--boolean-guardt-v)
- [`Guard<T extends V, V = unknown>`](#guardt-extends-v-v--unknown)
- [`TypeOfGuard<G>`](#typeofguardg)


## Installation

Install the library using npm or yarn:

```bash
npm install my-type-guards-library
```

## Usage
```typescript
import { tp } from 'typeofit'

const unknown: unknown;

if (tp.string(unknown)) // string

if (tp.number(unknown)) // number

if (tp.array()(unknown)) // unknown[]

if (tp.array(tp.string)(unknown)) // string[]

if (tp.record()(unknown)) // Record<string, any>

if (tp.record(tp.literal('foo'), tp.number)(unknown)) // { foo: number }

if (tp.tuple(tp.literal('foo'), tp.literal(10))(unknown)) // ['foo', 10]

if (tp.struct({ foo: tp.literal('bar') })(unknown)) // { foo: 'bar' }

if (tp.or(tp.literal('foo'), tp.literal('bar'))(unknown)) // 'foo' | 'bar'

const items: (number | null)[]
const defined = items.filter(tp.defined) // number[]
```
## API Reference

### `string`

A type guard function that checks if a value is of type string.

### `object`

A type guard function that checks if a value is of type object.

### `number`

A type guard function that checks if a value is of type number.

### `undef`

A type guard function that checks if a value is undefined.

### `func`

A type guard function that checks if a value is of type Function.

### `nul`

A type guard function that checks if a value is null.

### `literal<T extends any>(of: T)`

The `literal` function creates a type guard that checks if a value is equal to a specific literal value.

### `array<T = any>(of?: Guard<T>)`

The `array` function checks if a value is an array and optionally checks if all elements of the array match a given type guard.

### `tuple<T extends Guard<any>[]>(...of: T)`

The `tuple` function checks if a value is an array with elements that match the specified guards.

### `record<K extends string = string, V = any>(key?: Guard<K>, value?: Guard<V>)`

The `record` function checks if a given value is a valid record object, with optional key and value guards.

### `struct<T extends Record<any, Guard<any>>>(of: T, strict: boolean = true)`

The `struct` function is a type guard that checks if an object matches a given structure defined by a record of guards.

### `defined<T>(x: T | undefined | null): x is T`

The `defined` function checks if a value is defined (not `undefined` or `null`) and returns a boolean.

### `or<T extends Guard<any>[]>(...of: T)`

The `or` function allows you to check if a value matches any of the provided guards.

### `is<T extends V, V = unknown>(cb: (x: V) => boolean): Guard<T, V>`

The `is` function is a TypeScript type guard that checks if a value satisfies a given condition. It takes a callback function `cb` that takes a value of type `V` and returns a boolean value. The callback function is used to define the condition for type guarding.

### `Guard<T extends V, V = unknown>`

A type alias representing a TypeScript type guard function. It takes a value of type `V` and returns a boolean indicating whether the value is of type `T`.

### `TypeOfGuard<G>`

A conditional type that extracts the guarded type from a `Guard` function.

## License
MIT © [Dan Beaven](https://github.com/Pingid)