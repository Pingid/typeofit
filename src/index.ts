export interface Guard<T extends V, V = unknown> {
  (x: V): x is T
}
export type TypeOfGuard<G> = G extends (x: unknown) => x is infer A ? A : never

/**
 * The `is` function is a TypeScript type guard that checks if a value satisfies a given condition.
 * @param cb - The `cb` parameter is a callback function that takes a value of type `V` and returns a
 * boolean value. It is used to define the condition for type guarding.
 */
export const is =
  <T extends V, V = unknown>(cb: (x: V) => boolean): Guard<T, V> =>
  (t): t is any =>
    cb(t)

/**
 * The function checks if a value is of type string.
 * @param {unknown} value - The parameter "value" is of type "unknown", which means it can be any type.
 */
export const string = is<string>((t) => typeof t === 'string')

/**
 * The function checks if a value is of type object.
 * @param {unknown} value - The parameter "value" is of type "unknown", which means it can be any type.
 */
export const object = is<object>((t) => typeof t === 'object')

/**
 * The function checks if a value is of type number.
 * @param {unknown} value - The parameter "value" is of type "unknown", which means it can be any type.
 */
export const number = is<number>((t) => typeof t === 'number')

/**
 * The function `undef` checks if a value is undefined.
 * @param {unknown} value - The parameter "value" is of type "unknown", which means it can be any type.
 */
export const undef = is<undefined>((t) => typeof t === 'undefined')

/**
 * The function checks if a value is of type Function.
 * @param {unknown} value - The `value` parameter is of type `unknown`, which means it can be any type.
 */
export const func = is<Function>((t) => typeof t === 'function')

/**
 * The function `nul` checks if a value is null.
 * @param {unknown} value - The `value` parameter is of type `unknown`, which means it can be any type.
 */
export const nul = (value: unknown): value is null => value === null

/**
 * The `literal` function in TypeScript creates a type guard that checks if a value is equal to a
 * specific literal value.
 * @param {T} of - The `of` parameter is the value that you want to create a literal type for. It is
 * the value that you want to ensure is the only possible value for the resulting literal type.
 */
export const literal = <const T extends any>(of: T) => is<T>((t) => t === of)

/**
 * The function `array` is a TypeScript utility function that checks if a value is an array and
 * optionally checks if all elements of the array match a given type guard.
 * @param [of] - The "of" parameter is an optional guard function that specifies the type of elements
 * in the array. It is used to check if every element in the array satisfies a certain condition. If
 * the "of" parameter is provided, the guard function will be applied to each element in the array
 * using the `
 */
export const array = <T = any>(of?: Guard<T>) => is<T[]>((t) => Array.isArray(t) && (of ? t.every(of) : true))

/**
 * The `tuple` function in TypeScript is used to create a type guard that checks if a value is an array
 * with elements that match the specified guards.
 * @param {T} of - The `of` parameter is a rest parameter that allows you to pass in multiple arguments
 * of type `Guard<any>`. These arguments represent the guards that will be used to validate the
 * elements of the tuple.
 */
export const tuple = <T extends Guard<any>[]>(...of: T) =>
  is<{ [K in keyof T]: TypeOfGuard<T[K]> }>(
    (t) => Array.isArray(t) && t.length === of.length && of.every((g, i) => g(t[i])),
  )

/**
 * The `record` function in TypeScript is used to check if a given value is a valid record object, with
 * optional key and value guards.
 * @param [key] - The `key` parameter is an optional guard function that is used to validate the keys
 * of the record. It takes a single argument, which represents each key in the record, and returns a
 * boolean value indicating whether the key is valid or not.
 * @param [value] - The `value` parameter is a guard function that checks the type of each value in the
 * record. It is optional, meaning you can provide it or not. If provided, it will be used to validate
 * each value in the record. If not provided, all values will be considered valid.
 */
export const record = <K extends string = string, V = any>(key?: Guard<K>, value?: Guard<V>) =>
  is<Record<K, V>>((t) => {
    if (!object(t) || nul(t) || array()(t)) return false
    if (!key && !value) return true
    return Object.keys(t).every((k) => (key ? key(k) : true) && (value ? value((t as any)[k]) : true))
  })

/**
 * The `struct` function in TypeScript is a type guard that checks if an object matches a given
 * structure defined by a record of guards.
 * @param {T} of - The `of` parameter is an object that defines the structure of the input object. It
 * is a generic type `T` that extends `Record<any, Guard<any>>`. This means that `of` is an object
 * where each property key is of type `keyof T` and each property value
 * @param {boolean} [strict=true] - The `strict` parameter is a boolean flag that determines whether
 * the input object should strictly adhere to the structure defined by the `of` parameter.
 */
export const struct = <T extends Record<any, Guard<any>>>(of: T, strict: boolean = true) =>
  is<{ [K in keyof T]: TypeOfGuard<T[K]> }>((t) => {
    if (!record()(t)) return false
    const keys = Object.keys(of)
    if (strict && keys.length !== Object.keys(t).length) return false
    return keys.every((k) => of[k] && of[k]!(t[k]))
  })

/**
 * The function `defined` checks if a value is defined (not `undefined` or `null`) and returns a
 * boolean.
 * @param {T | undefined | null} x - The parameter `x` is of type `T | undefined | null`, which means
 * it can be of type `T`, `undefined`, or `null`.
 */
export const defined = <T>(x: T | undefined | null): x is T => x !== null && !undef(x)

/**
 * The `or` function in TypeScript allows you to check if a value matches any of the provided guards.
 * @param {T} of - The `of` parameter is a rest parameter that accepts an array of `Guard` types.
 */
export const or = <T extends Guard<any>[]>(...of: T) => is<TypeOfGuard<T[number]>>((t) => of.some((y) => y(t)))
