export const levelColorMap: Record<string, string> = {
  INTERN: "cyan",
  FRESHER: "lime",
  JUNIOR: "blue",
  MIDDLE: "orange",
  SENIOR: "red",
}

export const SALARY_OPTIONS = [
  { value: 0, label: "Dưới 5 triệu" },
  { value: 5000000, label: "5 triệu" },
  { value: 10000000, label: "10 triệu" },
  { value: 15000000, label: "15 triệu" },
  { value: 20000000, label: "20 triệu" },
  { value: 30000000, label: "30 triệu" },
  { value: 50000000, label: "50 triệu" },
  { value: 100000000, label: "Trên 100 triệu" },
]

export const DEFAULT_STATE = {
  page: 1,
  name: null,
  companyId: null,
  level: null,
  location: null,
  maxSalary: null,
  minSalary: null,
  skillId: null,
}
