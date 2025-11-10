package vn.phantruongan.backend.authorization.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import vn.phantruongan.backend.authorization.dtos.req.role.AssignPermissionsReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.role.CreateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.role.GetListRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.role.UpdateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.res.RoleResDTO;
import vn.phantruongan.backend.authorization.entities.Permission;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.entities.RolePermission;
import vn.phantruongan.backend.authorization.mappers.RoleMapper;
import vn.phantruongan.backend.authorization.repositories.PermissionRepository;
import vn.phantruongan.backend.authorization.repositories.RolePermissionRepository;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
import vn.phantruongan.backend.authorization.specification.RoleSpecification;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final PermissionRepository permissionRepository;
    private final RoleMapper roleMapper;

    public RoleService(RoleRepository roleRepository, RolePermissionRepository rolePermissionRepository,
            PermissionRepository permissionRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.permissionRepository = permissionRepository;
        this.roleMapper = roleMapper;
    }

    public PaginationResponse<RoleResDTO> getAllRole(GetListRoleReqDTO dto, Pageable pageable) {
        Specification<Role> spec = new RoleSpecification(dto);
        Page<Role> page = roleRepository.findAll(spec, pageable);
        List<RoleResDTO> list = page.getContent().stream()
                .map(roleMapper::toDto)
                .collect(Collectors.toList());

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    public RoleResDTO createRole(CreateRoleReqDTO dto) throws InvalidException {

        Role role = roleMapper.toEntity(dto);
        if (roleRepository.existsByName(dto.getName())) {
            throw new InvalidException("Role already exists");
        }
        Role roleSaved = roleRepository.save(role);
        return roleMapper.toDto(roleSaved);
    }

    public RoleResDTO updateRole(UpdateRoleReqDTO dto) throws InvalidException {
        Role existingRole = roleRepository.findById(dto.getId())
                .orElseThrow(() -> new InvalidException("Role not found"));

        roleMapper.updateEntityFromDto(dto, existingRole);

        Role roleUpdated = roleRepository.save(existingRole);
        return roleMapper.toDto(roleUpdated);
    }

    public RoleResDTO findById(long id) throws InvalidException {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Role not found with id: " + id));

        return roleMapper.toDto(role);
    }

    public boolean deleteRoleById(long id) throws InvalidException {
        if (id <= 0) {
            throw new InvalidException("Role ID must be a positive number.");
        }

        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Role not found."));

        roleRepository.delete(role);
        return true;
    }

    @Transactional
    public Map<String, Integer> assignPermissionsToRole(AssignPermissionsReqDTO dto) throws InvalidException {
        List<Long> newPermissionIds = dto.getPermissionIds();
        Long roleId = dto.getRoleId();
        Role role = roleRepository.findById(dto.getRoleId())
                .orElseThrow(() -> new InvalidException("Role not found with id: " + dto.getRoleId()));

        // Get list of permission current
        List<Long> oldPermissionIds = role.getRolePermissions().stream()
                .map(rp -> rp.getPermission().getId())
                .collect(Collectors.toList());

        Set<Long> oldSet = new HashSet<>(oldPermissionIds);
        Set<Long> newSet = new HashSet<>(newPermissionIds);
        if (oldSet.equals(newSet)) {
            return Map.of("addedCount", 0, "removedCount", 0);
        }

        // If have change, we determine permissions need to add and remove
        Set<Long> toAdd = new HashSet<>(newPermissionIds);
        toAdd.removeAll(oldPermissionIds);

        Set<Long> toRemove = new HashSet<>(oldPermissionIds);
        toRemove.removeAll(newPermissionIds);

        // Remove the permissions that were deselected
        if (!toRemove.isEmpty()) {
            rolePermissionRepository.deleteByRoleIdAndPermissionIds(roleId, new ArrayList<>(toRemove));
        }

        // Add the newly selected permissions
        int addedCount = 0;
        if (!toAdd.isEmpty()) {
            List<Permission> permissions = permissionRepository.findAllById(toAdd);
            List<RolePermission> newRps = permissions.stream()
                    .map(p -> {
                        RolePermission rp = new RolePermission();
                        rp.setRole(role);
                        rp.setPermission(p);
                        return rp;
                    })
                    .collect(Collectors.toList());
            rolePermissionRepository.saveAll(newRps);
            addedCount = newRps.size();
        }
        return Map.of("addedCount", addedCount, "removedCount", toRemove.size());
    }
}
