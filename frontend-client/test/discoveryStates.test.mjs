import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  getDiscoveryViewState,
  getJobDetailFailureState,
} from "../src/common/discovery/discoveryStates.mjs"

test("successful empty discovery results use the empty state", () => {
  assert.equal(
    getDiscoveryViewState({ isLoading: false, isError: false, items: [] }),
    "empty",
  )
})

test("failed job search followed by successful retry changes from error to results", () => {
  assert.equal(
    getDiscoveryViewState({ isLoading: false, isError: true, items: [] }),
    "error",
  )
  assert.equal(
    getDiscoveryViewState({ isLoading: false, isError: false, items: [{ id: 1 }] }),
    "results",
  )
})

test("failed company search followed by successful empty retry changes from error to empty", () => {
  assert.equal(
    getDiscoveryViewState({ isLoading: false, isError: true, items: [] }),
    "error",
  )
  assert.equal(
    getDiscoveryViewState({ isLoading: false, isError: false, items: [] }),
    "empty",
  )
})

test("job detail treats only an explicit HTTP 404 as not found", () => {
  assert.equal(getJobDetailFailureState({ response: { status: 404 } }), "notFound")
  assert.equal(getJobDetailFailureState({ response: { status: 500 } }), "error")
  assert.equal(getJobDetailFailureState(new Error("Network error")), "error")
})

test("English and Vietnamese locale files have matching translation keys", () => {
  const en = JSON.parse(readFileSync(new URL("../src/locales/en.json", import.meta.url), "utf8"))
  const vi = JSON.parse(readFileSync(new URL("../src/locales/vi.json", import.meta.url), "utf8"))
  const getKeys = (value, prefix = "") =>
    Object.entries(value).flatMap(([key, child]) =>
      child && typeof child === "object"
        ? getKeys(child, `${prefix}${key}.`)
        : [`${prefix}${key}`],
    )

  assert.deepEqual(getKeys(en).sort(), getKeys(vi).sort())
})
