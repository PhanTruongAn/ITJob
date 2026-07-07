// Đơn vị GIÂY - dùng cho session.maxAge của NextAuth
export const ACCESS_TOKEN_VALIDITY_SECONDS = 86_400 // 1 ngày
export const REFRESH_TOKEN_VALIDITY_SECONDS = 604_800 // 7 ngày

// Đơn vị MILLISECONDS - dùng cho Date.now() so sánh thời gian hết hạn
export const ACCESS_TOKEN_VALIDITY = ACCESS_TOKEN_VALIDITY_SECONDS * 1000
export const REFRESH_TOKEN_VALIDITY = REFRESH_TOKEN_VALIDITY_SECONDS * 1000
