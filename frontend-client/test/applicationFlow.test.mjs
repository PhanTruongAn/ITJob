import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  getApplyActionState,
  getAppliedCheckState,
  getListResponseState,
} from "../src/common/application/applicationStates.mjs"

const jobPage = readFileSync(
  new URL("../src/app/jobs/[id]/page.tsx", import.meta.url),
  "utf8",
)
const applyModal = readFileSync(
  new URL("../src/app/jobs/[id]/components/ApplyJobModal.tsx", import.meta.url),
  "utf8",
)

test("guest keeps the sign-in action and candidate roles are gated by applied state", () => {
  assert.equal(
    getApplyActionState({ sessionStatus: "unauthenticated", role: undefined }),
    "guest",
  )
  const notApplied = getAppliedCheckState({ data: null })
  assert.equal(notApplied, "notApplied")
  assert.equal(
    getApplyActionState({
      sessionStatus: "authenticated",
      role: "CANDIDATE",
      checkState: notApplied,
    }),
    "ready",
  )
  assert.equal(
    getApplyActionState({
      sessionStatus: "authenticated",
      role: "CANDIDATE",
      checkState: "applied",
    }),
    "applied",
  )
  assert.equal(getAppliedCheckState({ data: { id: 7 } }), "applied")
  assert.equal(
    getApplyActionState({
      sessionStatus: "authenticated",
      role: "EMPLOYER",
      checkState: "notApplied",
    }),
    "hidden",
  )
})

test("application check loading and failure do not become an apply-ready state", () => {
  assert.equal(
    getApplyActionState({
      sessionStatus: "authenticated",
      role: "CANDIDATE",
      checkState: "loading",
    }),
    "checking",
  )
  assert.equal(
    getApplyActionState({
      sessionStatus: "authenticated",
      role: "CANDIDATE",
      checkState: "error",
    }),
    "error",
  )
  assert.equal(getAppliedCheckState({}), "error")
  assert.equal(
    getApplyActionState({
      sessionStatus: "authenticated",
      role: "CANDIDATE",
      checkState: getAppliedCheckState({ data: null }),
    }),
    "ready",
  )
  assert.match(jobPage, /setAppliedCheckRetry\(\(count\) => count \+ 1\)/)
  assert.match(jobPage, /checkJobApplied\(jobId\)/)
})

test("CV list success distinguishes an empty list from a failed or invalid response", () => {
  assert.deepEqual(getListResponseState({ data: [] }), {
    state: "empty",
    items: [],
  })
  assert.deepEqual(getListResponseState({ data: [{ id: 1 }] }), {
    state: "available",
    items: [{ id: 1 }],
  })
  const failedList = getListResponseState({})
  assert.deepEqual(failedList, { state: "error", items: [] })
  const recoveredList = getListResponseState({ data: [] })
  assert.deepEqual(recoveredList, {
    state: "empty",
    items: [],
  })
  assert.match(applyModal, /onClick=\{\(\) => void fetchCvs\(\)\}/)
  assert.match(applyModal, /onClick=\{\(\) => void fetchBuilderCvs\(\)\}/)
  assert.match(applyModal, /application\.cvLoadError/)
  assert.match(applyModal, /application\.builderCvLoadError/)
})

test("application submission is single-flight and success invalidates candidate applications", () => {
  assert.match(applyModal, /if \(submissionInProgress\.current\) return/)
  assert.match(applyModal, /submissionInProgress\.current = true/)
  assert.match(applyModal, /submissionInProgress\.current = false/)
  assert.match(applyModal, /invalidateQueries\(\{ queryKey: myResumesQueryKey\(user\?\.id\) \}\)/)
  assert.match(applyModal, /onSuccess\(\)/)
})
