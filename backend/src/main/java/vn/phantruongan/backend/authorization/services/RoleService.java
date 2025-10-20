package vn.phantruongan.backend.authorization.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import vn.phantruongan.backend.authorization.dtos.req.CreateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.GetListRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.UpdateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.res.RoleResDTO;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.mappers.RoleMapper;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
import vn.phantruongan.backend.authorization.specification.RoleSpecification;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
public class RoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    public RoleService(RoleRepository roleRepository, RoleMapper roleMapper) {
        this.roleRepository = roleRepository;
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

        Role companyUpdated = roleRepository.save(existingRole);
        return roleMapper.toDto(companyUpdated);
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
}
