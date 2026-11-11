import test from "node:test"
import assert from "node:assert/strict"
import {
  assertApiSuccess,
  shouldRetryQuery,
} from "../src/common/utils/queryBehavior.mjs"

test("successful API response wrappers pass through unchanged", () => {
  const response = { statusCode: 200, message: "OK", data: [] }
  assert.equal(assertApiSuccess(response), response)
})

test("failed API response wrappers reject with their backend message and status", () => {
  assert.throws(
    () => assertApiSuccess({ statusCode: 403, message: "Forbidden", data: null }),
    (error) => error.message === "Forbidden" && error.statusCode === 403,
  )
})

test("query retry skips client errors but allows one transient retry", () => {
  for (const status of [400, 401, 403, 404]) {
    assert.equal(shouldRetryQuery(0, { response: { status } }), false)
  }
  assert.equal(shouldRetryQuery(0, { response: { status: 503 } }), true)
  assert.equal(shouldRetryQuery(1, new Error("network")), false)
})
