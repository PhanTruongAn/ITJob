package vn.phantruongan.backend.config.ratelimit;

import java.io.IOException;
import java.time.Duration;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Servlet Filter áp dụng Rate Limiting cho các API nhạy cảm.
 * Chạy trước khi request vào Security chain.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {

    private final RateLimitService rateLimitService;
    private final ObjectMapper objectMapper;

    // Cấu hình giới hạn cho từng loại endpoint
    private static final int AUTH_MAX_REQUESTS = 10;
    private static final Duration AUTH_WINDOW = Duration.ofMinutes(1);

    private static final int REFRESH_MAX_REQUESTS = 30;
    private static final Duration REFRESH_WINDOW = Duration.ofMinutes(1);

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String clientIp = getClientIp(request);

        RateLimitConfig config = resolveRateLimitConfig(path);

        if (config != null) {
            boolean allowed = rateLimitService.isAllowed(
                    config.endpointKey(),
                    clientIp,
                    config.maxRequests(),
                    config.window());

            if (!allowed) {
                sendRateLimitResponse(response, config.endpointKey(), clientIp);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private RateLimitConfig resolveRateLimitConfig(String path) {
        if (path.equals("/api/v1/auth/login") || path.equals("/api/v1/auth/google")) {
            return new RateLimitConfig("auth_login", AUTH_MAX_REQUESTS, AUTH_WINDOW);
        }
        if (path.equals("/api/v1/auth/register")) {
            return new RateLimitConfig("auth_register", AUTH_MAX_REQUESTS, AUTH_WINDOW);
        }
        if (path.equals("/api/v1/auth/refresh")) {
            return new RateLimitConfig("auth_refresh", REFRESH_MAX_REQUESTS, REFRESH_WINDOW);
        }
        return null;
    }

    private void sendRateLimitResponse(
            HttpServletResponse response,
            String endpointKey,
            String clientIp) throws IOException {

        log.warn("[RateLimit] Request blocked for ip={} on endpoint={}", clientIp, endpointKey);

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        var body = new java.util.LinkedHashMap<String, Object>();
        body.put("statusCode", 429);
        body.put("message", "Too many requests. Please try again later.");
        body.put("error", "Rate limit exceeded");

        response.getWriter().write(objectMapper.writeValueAsString(body));
    }

    /**
     * Lấy IP thực của client, hỗ trợ cả trường hợp qua proxy / load balancer.
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isBlank()) {
            // Lấy IP đầu tiên trong chuỗi (IP gốc của client)
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isBlank()) {
            return xRealIp.trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Record cấu hình rate limit cho mỗi endpoint.
     */
    private record RateLimitConfig(String endpointKey, int maxRequests, Duration window) {}
}
