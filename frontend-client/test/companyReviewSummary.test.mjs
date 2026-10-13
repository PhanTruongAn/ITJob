import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const reviewTab = readFileSync(
  new URL("../src/app/companies/[id]/components/CompanyReviewsTab.tsx", import.meta.url),
  "utf8",
)

test("review summary uses company-wide aggregates instead of the current page histogram", () => {
  assert.match(reviewTab, /useCompanyReviewSummary\(companyId\)/)
  for (const rating of ["one", "two", "three", "four", "five"]) {
    assert.match(reviewTab, new RegExp(`${rating}StarCount`))
  }
  assert.doesNotMatch(reviewTab, /reviews\.forEach/)
  assert.match(reviewTab, /totalReviewsCount > 0 \? \(count \/ totalReviewsCount\)/)
})

test("review list or summary failures show a retry that refetches both requests", () => {
  assert.match(reviewTab, /isReviewsError \|\| isSummaryError/)
  assert.match(reviewTab, /void refetchReviews\(\)/)
  assert.match(reviewTab, /void refetchSummary\(\)/)
  assert.match(reviewTab, /companyReviews\.loadError/)
})

test("companies without an aggregate average do not render a zero-star average", () => {
  assert.match(reviewTab, /summary\?\.averageRating != null/)
  assert.match(reviewTab, /companyReviews\.notRated/)
  assert.doesNotMatch(reviewTab, /rating !== undefined && rating > 0 \? rating : 0/)
})
