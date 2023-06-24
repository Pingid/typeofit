export interface Guard<T extends V, V = unknown> {
  (x: V): x is T
}
export type TypeOfGuard<G> = G extends (x: unknown) => x is infer A ? A : never

export const is =
  <T extends V, V = unknown>(cb: (x: V) => boolean): Guard<T, V> =>
  (t): t is any =>
    cb(t)

export const string = is<string>((t) => typeof t === 'string')

export const object = is<object>((t) => typeof t === 'object')

export const number = is<number>((t) => typeof t === 'number')

export const undef = is<undefined>((t) => typeof t === 'undefined')

export const func = is<Function>((t) => typeof t === 'function')

export const nul = is<null>((t) => t === null)

export const literal = <const T extends any>(of: T) => is<T>((t) => t === of)

export const array = <T = any>(of?: Guard<T>) => is<T[]>((t) => Array.isArray(t) && (of ? t.every(of) : true))

export const tuple = <T extends Guard<any>[]>(...of: T) =>
  is<{ [K in keyof T]: TypeOfGuard<T[K]> }>(
    (t) => Array.isArray(t) && t.length === of.length && of.every((g, i) => g(t[i])),
  )

export const record = <K extends string = string, V = any>(key?: Guard<K>, value?: Guard<V>) =>
  is<Record<K, V>>((t) => {
    if (!object(t) || nul(t) || array()(t)) return false
    if (!key && !value) return true
    return Object.keys(t).every((k) => (key ? key(k) : true) && (value ? value((t as any)[k]) : true))
  })

export const struct = <T extends Record<any, Guard<any>>>(of: T, strict: boolean = true) =>
  is<{ [K in keyof T]: TypeOfGuard<T[K]> }>((t) => {
    if (!record()(t)) return false
    const keys = Object.keys(of)
    if (strict && keys.length !== Object.keys(t).length) return false
    return keys.every((k) => of[k] && of[k]!(t[k]))
  })

export const defined = <T>(x: T | undefined | null): x is T => x !== null && !undef(x)

export const or = <T extends Guard<any>[]>(...of: T) => is<TypeOfGuard<T[number]>>((t) => of.some((y) => y(t)))
