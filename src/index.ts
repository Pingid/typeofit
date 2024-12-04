export interface Guard<T extends V, V = unknown> {
  (x: V): x is T
}
export type TypeOfGuard<G> = G extends (x: unknown) => x is infer A ? A : never

/**
 * A type guard that checks if a value satisfies a condition.
 */
export const is =
  <T extends V, V = unknown>(cb: (x: V) => boolean): Guard<T, V> =>
  (t): t is any =>
    cb(t)

/**
 * Checks if a value is a string.
 */
export const string = is<string>((t) => typeof t === 'string')

/**
 * Checks if a value is a boolean.
 */
export const bool = is<boolean>((t) => typeof t === 'boolean')

/**
 * Checks if a value is a symbol.
 */
export const symb = is<symbol>((t) => typeof t === 'symbol')

/**
 * Checks if a value is an object.
 */
export const object = is<object>((t) => typeof t === 'object')

/**
 * Checks if a value is a number.
 */
export const number = is<number>((t) => typeof t === 'number')

/**
 * Checks if a value is undefined.
 */
export const undef = is<undefined>((t) => typeof t === 'undefined')

/**
 * Checks if a value is a function.
 */
export const func = is<Function>((t) => typeof t === 'function')

/**
 * Checks if a value is null.
 */
export const nul = (value: unknown): value is null => value === null

/**
 * Creates a type guard for a specific literal value.
 */
export const literal = <const T extends any>(of: T) => is<T>((t) => t === of)

/**
 * Checks if a value is a Date.
 */
export const date = is<Function>((t) => t instanceof Date)

/**
 * Checks if a value is an array and optionally matches a type guard.
 */
export const array = <T = any>(of?: Guard<T>) => is<T[]>((t) => Array.isArray(t) && (of ? t.every(of) : true))

/**
 * Creates a type guard for an array matching specific guards.
 */
export const tuple = <T extends Guard<any>[]>(...of: T) =>
  is<{ [K in keyof T]: TypeOfGuard<T[K]> }>(
    (t) => Array.isArray(t) && t.length === of.length && of.every((g, i) => g(t[i])),
  )

/**
 * Checks if a value is a record object with optional key and value guards.
 */
export const record = <K extends string = string, V = any>(key?: Guard<K>, value?: Guard<V>) =>
  is<Record<K, V>>((t) => {
    if (!object(t) || nul(t) || array()(t)) return false
    if (!key && !value) return true
    return Object.keys(t).every((k) => (key ? key(k) : true) && (value ? value((t as any)[k]) : true))
  })

/**
 * Creates a type guard for an object matching a given structure.
 */
export const struct = <T extends Record<any, Guard<any>>>(of: T, strict: boolean = true) =>
  is<{ [K in keyof T]: TypeOfGuard<T[K]> }>((t) => {
    if (!record()(t)) return false
    const keys = Object.keys(of)
    if (strict && keys.length !== Object.keys(t).length) return false
    return keys.every((k) => of[k] && of[k]!(t[k]))
  })

/**
 * Checks if a value is defined (not null or undefined).
 */
export const defined = <T>(x: T | undefined | null): x is T => x !== null && !undef(x)

/**
 * Checks if a value matches any of the provided guards.
 */
export const or = <T extends Guard<any>[]>(...of: T) => is<TypeOfGuard<T[number]>>((t) => of.some((y) => y(t)))

export const tp = {
  is: is,
  string: string,
  boolean: bool,
  symbol: symb,
  object: object,
  number: number,
  undefined: undef,
  function: func,
  null: nul,
  literal: literal,
  date: date,
  array: array,
  tuple: tuple,
  record: record,
  struct: struct,
  defined: defined,
  or: or,
}
