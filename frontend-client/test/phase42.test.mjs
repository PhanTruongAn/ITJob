import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

const readSource = (path) =>
  readFileSync(new URL(path, import.meta.url), "utf8")

test("job invitations route shows unavailable information without fabricated records or counts", () => {
  const page = readSource("../src/app/candidate/job-invitations/page.tsx")
  const profilePage = readSource("../src/app/candidate/profile/page.tsx")
  const activityOverview = readSource("../src/app/candidate/profile/components/ActivityOverview.tsx")
  const dashboardStats = readSource("../src/app/candidate/dashboard/components/StatsCards.tsx")

  for (const sample of ["Nexus Systems", "CloudScale Solutions", "Senior Full Stack Engineer"]) {
    assert.equal(page.includes(sample), false)
  }
  for (const fabricatedCount of [">12<", ">4<", "invitationsCount={0}"]) {
    assert.equal(page.includes(fabricatedCount), false)
    assert.equal(profilePage.includes(fabricatedCount), false)
  }
  assert.match(page, /jobInvitations\.notAvailable/)
  assert.match(activityOverview, /jobInvitations\.notAvailable/)
  assert.match(dashboardStats, /jobInvitations\.notAvailable/)
  assert.match(page, /useSession/)
})

test("candidate invitation links stay available without a fabricated zero badge", () => {
  const sideNav = readSource("../src/app/candidate/components/SideNavBar.tsx")
  const appBar = readSource("../src/components/AppAppBar.tsx")
  const dashboardStats = readSource("../src/app/candidate/dashboard/components/StatsCards.tsx")

  assert.match(sideNav, /href: "\/candidate\/job-invitations"/)
  assert.match(appBar, /href="\/candidate\/job-invitations"/)
  assert.doesNotMatch(sideNav, /badge:\s*0/)
  assert.match(dashboardStats, /unavailable: true/)
  assert.match(dashboardStats, /jobInvitations\.notAvailable/)
})

test("job filter sidebar has no inert job-alert subscription controls", () => {
  const sidebar = readSource("../src/app/jobs/components/JobFilterSideBar.tsx")

  assert.doesNotMatch(sidebar, /Nhận thông báo việc làm|Đăng ký ngay|Email của bạn/)
  assert.doesNotMatch(sidebar, /TextField/)
  assert.match(sidebar, /handleSkillToggle/)
  assert.match(sidebar, /handleSalaryChange/)
  assert.match(sidebar, /onClearFilters/)
})
