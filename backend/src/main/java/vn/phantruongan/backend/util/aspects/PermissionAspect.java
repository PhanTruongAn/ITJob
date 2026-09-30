package vn.phantruongan.backend.util.aspects;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import vn.phantruongan.backend.authorization.services.PermissionService;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

@Aspect
@Component
public class PermissionAspect {

    private final PermissionService permissionService;
    private final UserRepository userRepository;

    public PermissionAspect(PermissionService permissionService, UserRepository userRepository) {
        this.permissionService = permissionService;
        this.userRepository = userRepository;
    }

    @Around("@annotation(requirePermission)")
    public Object check(ProceedingJoinPoint joinPoint, RequirePermission requirePermission) throws Throwable {
        // Lấy thông tin người dùng hiện tại từ SecurityContextHolder
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadCredentialsException("User not authenticated");
        }

        // Lấy JWT trong principal
        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Jwt jwt)) {
            throw new BadCredentialsException("Invalid authentication principal");
        }

        // Resolve the current role from the database so role changes take effect
        // immediately instead of waiting for the access token to expire.
        User user = userRepository.findByEmail(jwt.getSubject())
                .orElseThrow(() -> new BadCredentialsException("Authenticated user no longer exists"));
        if (user.getRole() == null) {
            throw new BadCredentialsException("User has no assigned role");
        }
        if (!user.getRole().isActive()) {
            throw new PermissionDeniedException("User role is inactive");
        }

        if ("ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            return joinPoint.proceed();
        }

        // Kiểm tra quyền theo resource và action trong annotation
        boolean allowed = permissionService.hasPermission(user.getRole().getId(),
                requirePermission.resource(),
                requirePermission.action());

        if (!allowed) {
            throw new PermissionDeniedException("You don't have permission to perform this action");
        }

        // Nếu hợp lệ thì tiếp tục thực thi method
        return joinPoint.proceed();
    }
}
