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
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

@Aspect
@Component
public class PermissionAspect {

    private final PermissionService permissionService;

    public PermissionAspect(PermissionService permissionService) {
        this.permissionService = permissionService;
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

        // Lấy roleId từ JWT claim (do bạn đã set trong SecurityUtil)
        Long roleId = jwt.getClaim("roleId");
        if (roleId == null) {
            throw new BadCredentialsException("Role ID not found in token");
        }

        // Nếu roleId = 1 (ADMIN) thì bỏ qua check permission
        if (roleId == 1L) {
            return joinPoint.proceed();
        }

        // Kiểm tra quyền theo resource và action trong annotation
        boolean allowed = permissionService.hasPermission(roleId,
                requirePermission.resource(),
                requirePermission.action());

        if (!allowed) {
            throw new PermissionDeniedException("You don't have permission to perform this action");
        }

        // Nếu hợp lệ thì tiếp tục thực thi method
        return joinPoint.proceed();
    }
}