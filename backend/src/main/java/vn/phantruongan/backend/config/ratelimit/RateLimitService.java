package vn.phantruongan.backend.config.ratelimit;

import java.time.Duration;
import java.util.Objects;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Rate Limiting Service dùng Sliding Window Counter với Redis.
 * Key pattern: rate_limit:<endpoint_key>:<client_ip>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String KEY_PREFIX = "rate_limit:";

    /**
     * Kiểm tra xem request từ IP có vượt quá giới hạn không.
     *
     * @param endpointKey Identifier của endpoint (ví dụ: "auth_login")
     * @param clientIp    IP của client
     * @param maxRequests Số request tối đa trong window
     * @param window      Khoảng thời gian window
     * @return true nếu request được phép, false nếu bị chặn
     */
    public boolean isAllowed(String endpointKey, String clientIp, int maxRequests, Duration window) {
        String key = KEY_PREFIX + endpointKey + ":" + clientIp;

        try {
            Long count = redisTemplate.opsForValue().increment(key);

            // Lần đầu tiên: set TTL
            if (Objects.equals(count, 1L)) {
                redisTemplate.expire(key, window);
            }

            if (count != null && count > maxRequests) {
                log.warn("[RateLimit] BLOCKED - endpoint={}, ip={}, count={}/{}", endpointKey, clientIp, count, maxRequests);
                return false;
            }

            return true;
        } catch (Exception e) {
            // Nếu Redis lỗi → để request đi qua (fail open) để tránh outage
            log.error("[RateLimit] Redis error for key={}: {}", key, e.getMessage());
            return true;
        }
    }

    /**
     * Lấy số request còn lại trong window hiện tại.
     */
    public long getRemainingRequests(String endpointKey, String clientIp, int maxRequests) {
        String key = KEY_PREFIX + endpointKey + ":" + clientIp;
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value == null) return maxRequests;
            long count = Long.parseLong(value.toString());
            return Math.max(0, maxRequests - count);
        } catch (Exception e) {
            return maxRequests;
        }
    }
}
