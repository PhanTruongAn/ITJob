export const COMPANY_SIZE = [
  { label: "1-50 (Startup)", value: "1-50", color: "green" },
  { label: "51-150 (Scale-up)", value: "51-150", color: "cyan" },
  { label: "151-300 (Established)", value: "151-300", color: "orange" },
  { label: "301-500 (Major)", value: "301-500", color: "red" },
  { label: "1000+ (Corporate)", value: "1000+", color: "volcano" },
]

export const COMPANY_STATUS = [
  { label: "Pending", value: "PENDING", color: "" },
  { label: "Checking", value: "CHECKING", color: "blue" },
  { label: "Approved", value: "APPROVED", color: "green" },
  { label: "Rejected", value: "REJECTED", color: "red" },
]
export const companySizeColorMap: Record<string, string> = {
  "1-50": "green",
  "51-150": "cyan",
  "151-300": "orange",
  "301-500": "red",
  "1000+": "volcano",
}
export const companyTypeColorMap: Record<string, string> = {
  IT_OUTSOURCING: "blue",
  IT_PRODUCT: "green",
  IT_SERVICE_AND_CONSULTING: "purple",
}
export const DEFAULT_STATE = {
  page: 1,
  name: null,
  address: null,
  companySize: null,
  companyType: null,
  countryId: null,
  status: null,
}
