package vn.phantruongan.backend.authorization.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.dtos.req.permission.CreatePermissionReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.permission.GetListPermissionReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.permission.UpdatePermissionReqDTO;
import vn.phantruongan.backend.authorization.dtos.res.PermissionResDTO;
import vn.phantruongan.backend.authorization.entities.Permission;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.authorization.mappers.PermissionMapper;
import vn.phantruongan.backend.authorization.repositories.PermissionRepository;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
import vn.phantruongan.backend.authorization.specification.PermissionSpecification;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class PermissionService {
    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final PermissionMapper permissionMapper;

    public PaginationResponse<PermissionResDTO> getAllPermission(GetListPermissionReqDTO dto, Pageable pageable) {
        Specification<Permission> spec = new PermissionSpecification(dto);
        Page<Permission> page = permissionRepository.findAll(spec, pageable);
        List<PermissionResDTO> list = page.getContent().stream()
                .map(permissionMapper::toDto)
                .collect(Collectors.toList());

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    public PermissionResDTO createPermission(CreatePermissionReqDTO dto) {
        Permission permission = permissionMapper.toEntity(dto);
        Permission roleSaved = permissionRepository.save(permission);
        return permissionMapper.toDto(roleSaved);
    }

    public PermissionResDTO updatePermission(UpdatePermissionReqDTO dto) throws InvalidException {
        Permission existingPermission = permissionRepository.findById(dto.getId())
                .orElseThrow(() -> new InvalidException("Permission not found"));

        permissionMapper.updateEntityFromDto(dto, existingPermission);

        Permission permissionUpdated = permissionRepository.save(existingPermission);
        return permissionMapper.toDto(permissionUpdated);
    }

    public PermissionResDTO findById(long id) throws InvalidException {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Permission not found with id: " + id));

        return permissionMapper.toDto(permission);
    }

    public boolean deletePermissionById(long id) throws InvalidException {
        if (id <= 0) {
            throw new InvalidException("Permission ID must be a positive number.");
        }

        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Permission not found."));

        permissionRepository.delete(permission);
        return true;
    }

    // Kiểm tra quyền theo key
    @Cacheable(cacheNames = "permissions", key = "#roleId + '_' + #resource + '_' + #action")
    public boolean hasPermission(Long roleId, ResourceEnum resource, ActionEnum action) {

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));

        String permissionKey = resource + "_" + action;

        return role.getRolePermissions().stream()
                .anyMatch(rp -> rp.getPermission().getPermissionKey().equals(permissionKey));
    }
}
