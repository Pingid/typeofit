import { it, expect } from 'vitest'

import { string, object, number, undef, literal, func, nul, defined, array, tuple, record, struct, or } from './index'

it('string', () => (expect(string(1)).toBe(false), expect(string('')).toBe(true)))
it('object', () => (expect(object(null)).toBe(true), expect(object([])).toBe(true), expect(object({})).toBe(true)))
it('number', () => (expect(number('')).toBe(false), expect(number(0)).toBe(true)))
it('undefined', () => (expect(undef(undefined)).toBe(true), expect(undef(null)).toBe(false)))
it('function', () => (expect(func(() => {})).toBe(true), expect(func(null)).toBe(false)))
it('nul', () => (expect(nul(null)).toBe(true), expect(nul(undefined)).toBe(false)))
it('defined', () => (
  expect(defined({})).toBe(true), expect(defined(undefined)).toBe(false), expect(defined(null)).toBe(false)
))

it('array', () => (
  expect(array()([])).toBe(true),
  expect(array()({})).toBe(false),
  expect(array(string)([])).toBe(true),
  expect(array(string)(['1'])).toBe(true),
  expect(array(string)(['1', 1])).toBe(false)
))

it('tuple', () => (
  expect(tuple(string)([''])).toBe(true),
  expect(tuple(literal('1'), literal(10))(['1', 10])).toBe(true),
  expect(tuple(literal('1'), literal(10))(['1', 10, 11])).toBe(false)
))

it('record', () => (
  expect(record()({})).toBe(true),
  expect(record()([])).toBe(false),
  expect(record()(NaN)).toBe(false),
  expect(record(literal('123'), number)({ '123': 10 })).toBe(true),
  expect(record(literal('123'), string)({ '123': 10 })).toBe(false),
  expect(record(literal('123'))({ '123': 10 })).toBe(true)
))

it('struct', () => (
  expect(struct({ one: string, two: number })({ one: '1', two: 2 })).toBe(true),
  expect(struct({ one: string, two: number })({ one: '1' })).toBe(false),
  expect(struct({ one: string, two: number })({ one: '1', two: 2, three: 3 })).toBe(false),
  expect(struct({ one: string, two: number }, false)({ one: '1', two: 2, three: 3 })).toBe(true)
))

it('struct', () => (
  expect(or(literal(10), literal(11))(11)).toBe(true), expect(or(literal(10), literal(11))(12)).toBe(false)
))
