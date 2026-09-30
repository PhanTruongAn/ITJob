import assert from "node:assert/strict"
import test from "node:test"
import {
  canAccessCandidateArea,
  getRequestErrorMessage,
  isCandidateRole,
  requiresCandidateRole,
} from "../src/common/security/frontendSecurity.mjs"

test("candidate routes require a candidate role", () => {
  assert.equal(canAccessCandidateArea({ user: { role: "CANDIDATE" } }), true)
  assert.equal(canAccessCandidateArea({ user: {} }), false)
  assert.equal(canAccessCandidateArea(null), false)
})

test("candidate routes reject known non-candidate roles", () => {
  assert.equal(canAccessCandidateArea({ user: { role: "EMPLOYER" } }), false)
  assert.equal(canAccessCandidateArea({ user: { role: "MANAGER" } }), false)
})

test("candidate role matching is case-insensitive and rejects missing roles", () => {
  assert.equal(isCandidateRole("candidate"), true)
  assert.equal(isCandidateRole("EMPLOYER"), false)
  assert.equal(isCandidateRole(undefined), false)
})

test("only candidate routes require the candidate role; profile paths remain session-only", () => {
  assert.equal(requiresCandidateRole("/candidate"), true)
  assert.equal(requiresCandidateRole("/candidate/cv-builder"), true)
  assert.equal(requiresCandidateRole("/profile"), false)
  assert.equal(requiresCandidateRole("/profile/security"), false)
  assert.equal(requiresCandidateRole("/companies/123/profile"), false)
})

test("403 errors use the authorization-specific message", () => {
  assert.equal(
    getRequestErrorMessage({ response: { status: 403, data: { message: "Forbidden" } } }, {
      forbidden: "No permission",
      fallback: "Failed",
    }),
    "No permission",
  )
})

test("other API errors preserve backend messages and use fallback when absent", () => {
  assert.equal(
    getRequestErrorMessage({ response: { status: 400, data: { message: "Invalid" } } }, {
      forbidden: "No permission",
      fallback: "Failed",
    }),
    "Invalid",
  )
  assert.equal(getRequestErrorMessage({}, { forbidden: "No permission", fallback: "Failed" }), "Failed")
})
