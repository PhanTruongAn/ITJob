package vn.phantruongan.backend.authorization.controllers;

import java.util.Map;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authorization.dtos.req.role.AssignPermissionsReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.role.CreateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.role.GetListRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.role.UpdateRoleReqDTO;
import vn.phantruongan.backend.authorization.dtos.res.RoleResDTO;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
import vn.phantruongan.backend.authorization.services.RoleService;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Role Controller", description = "Quản lý vai trò")
@RequiredArgsConstructor
public class RoleController {

    private final RoleRepository roleRepository;
    private final RoleService roleService;

    @RequirePermission(resource = ResourceEnum.ROLE, action = ActionEnum.READ)
    @GetMapping("/roles")
    @ApiMessage("Get list role with filter")
    public ResponseEntity<PaginationResponse<RoleResDTO>> getAllRoles(
            @ParameterObject GetListRoleReqDTO dto,
            @ParameterObject Pageable pageable) {

        PaginationResponse<RoleResDTO> result = roleService.getAllRole(dto, pageable);
        return ResponseEntity.ok(result);
    }

    @RequirePermission(resource = ResourceEnum.ROLE, action = ActionEnum.CREATE)
    @PostMapping("/roles")
    @ApiMessage("Create new role")
    public ResponseEntity<RoleResDTO> createCompany(@Valid @RequestBody CreateRoleReqDTO dto)
            throws InvalidException {
        RoleResDTO newRole = roleService.createRole(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newRole);
    }

    @RequirePermission(resource = ResourceEnum.ROLE, action = ActionEnum.UPDATE)
    @PutMapping("/roles")
    @ApiMessage("Role updated")
    public ResponseEntity<RoleResDTO> updateCompany(@Valid @RequestBody UpdateRoleReqDTO dto)
            throws InvalidException {

        RoleResDTO roleUpdated = roleService.updateRole(dto);
        return ResponseEntity.ok(roleUpdated);
    }

    @RequirePermission(resource = ResourceEnum.ROLE, action = ActionEnum.READ)
    @GetMapping("/roles/{id}")
    @ApiMessage("Get role by id")
    public ResponseEntity<RoleResDTO> findCompanyById(@PathVariable("id") long id) throws InvalidException {
        RoleResDTO role = roleService.findById(id);
        return ResponseEntity.ok(role);
    }

    @RequirePermission(resource = ResourceEnum.ROLE, action = ActionEnum.DELETE)
    @DeleteMapping("/roles/{id}")
    @ApiMessage("Role deleted")
    public ResponseEntity<Boolean> deleteCompany(@PathVariable("id") long id) throws InvalidException {
        boolean isDelete = roleService.deleteRoleById(id);

        return ResponseEntity.ok(isDelete);

    }

    @RequirePermission(resource = ResourceEnum.ROLE, action = ActionEnum.UPDATE)
    @PostMapping("/roles/assign-permissions")
    @ApiMessage("Assign permissions to role")
    public ResponseEntity<Map<String, Integer>> assignPermissionsToRole(
            @Valid @RequestBody AssignPermissionsReqDTO dto) throws InvalidException {

        Map<String, Integer> result = roleService.assignPermissionsToRole(dto);
        return ResponseEntity.ok(result);
    }

}
