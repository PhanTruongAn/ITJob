package vn.phantruongan.backend.authorization.controllers;

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
import vn.phantruongan.backend.authorization.dtos.req.permission.CreatePermissionReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.permission.GetListPermissionReqDTO;
import vn.phantruongan.backend.authorization.dtos.req.permission.UpdatePermissionReqDTO;
import vn.phantruongan.backend.authorization.dtos.res.PermissionResDTO;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.authorization.services.PermissionService;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.PERMISSIONS)
@Tag(name = "Permission Controller", description = "Quản lý quyền hạn")
@RequiredArgsConstructor
public class PermissionController {
    private final PermissionService permissionService;

    @RequirePermission(resource = ResourceEnum.PERMISSION, action = ActionEnum.READ)
    @GetMapping()
    @ApiMessage("Get list permission with filter")
    public ResponseEntity<PaginationResponse<PermissionResDTO>> getAllPermissions(
            @ParameterObject GetListPermissionReqDTO dto,
            @ParameterObject Pageable pageable) {

        PaginationResponse<PermissionResDTO> result = permissionService.getAllPermission(dto, pageable);
        return ResponseEntity.ok(result);
    }

    @RequirePermission(resource = ResourceEnum.PERMISSION, action = ActionEnum.CREATE)
    @PostMapping()
    @ApiMessage("Create new permission")
    public ResponseEntity<PermissionResDTO> createCompany(@Valid @RequestBody CreatePermissionReqDTO dto) {
        PermissionResDTO newPermission = permissionService.createPermission(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newPermission);
    }

    @RequirePermission(resource = ResourceEnum.PERMISSION, action = ActionEnum.UPDATE)
    @PutMapping()
    @ApiMessage("Permission updated")
    public ResponseEntity<PermissionResDTO> updateCompany(@Valid @RequestBody UpdatePermissionReqDTO dto)
            throws InvalidException {

        PermissionResDTO permissionUpdated = permissionService.updatePermission(dto);
        return ResponseEntity.ok(permissionUpdated);
    }

    @RequirePermission(resource = ResourceEnum.PERMISSION, action = ActionEnum.READ)
    @GetMapping("/{id}")
    @ApiMessage("Get permission by id")
    public ResponseEntity<PermissionResDTO> findCompanyById(@PathVariable("id") long id) throws InvalidException {
        PermissionResDTO permission = permissionService.findById(id);
        return ResponseEntity.ok(permission);
    }

    @RequirePermission(resource = ResourceEnum.PERMISSION, action = ActionEnum.DELETE)
    @DeleteMapping("/{id}")
    @ApiMessage("Permission deleted")
    public ResponseEntity<Boolean> deleteCompany(@PathVariable("id") long id) throws InvalidException {
        boolean isDelete = permissionService.deletePermissionById(id);

        return ResponseEntity.ok(isDelete);

    }

}
