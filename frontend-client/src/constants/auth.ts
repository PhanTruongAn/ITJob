// Đơn vị GIÂY - dùng cho session.maxAge của NextAuth
export const ACCESS_TOKEN_VALIDITY_SECONDS = 86_400 // 1 ngày
const configuredRefreshValidity = Number(process.env.JWT_REFRESH_TOKEN_VALIDITY_IN_SECONDS)
export const REFRESH_TOKEN_VALIDITY_SECONDS =
  Number.isFinite(configuredRefreshValidity) && configuredRefreshValidity > 0
    ? configuredRefreshValidity
    : 604_800

// Đơn vị MILLISECONDS - dùng cho Date.now() so sánh thời gian hết hạn
export const ACCESS_TOKEN_VALIDITY = ACCESS_TOKEN_VALIDITY_SECONDS * 1000
export const REFRESH_TOKEN_VALIDITY = REFRESH_TOKEN_VALIDITY_SECONDS * 1000
