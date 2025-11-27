package vn.phantruongan.backend.authentication.controllers;

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

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.req.CreateUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.req.GetListUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.req.UpdateUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.res.UserResDTO;
import vn.phantruongan.backend.authentication.services.UserService;
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.USERS)
@Tag(name = "User Controller", description = "Quản lý người dùng")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    private final UserService userService;

    @RequirePermission(resource = ResourceEnum.USER, action = ActionEnum.CREATE)
    @PostMapping()
    @ApiMessage("User created")
    public ResponseEntity<UserResDTO> createNewUser(@Valid @RequestBody CreateUserReqDTO dto) throws InvalidException {
        UserResDTO dataUser = userService.createUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(dataUser);
    }

    @RequirePermission(resource = ResourceEnum.USER, action = ActionEnum.UPDATE)
    @PutMapping()
    @ApiMessage("User updated")
    public ResponseEntity<UserResDTO> updateUser(@Valid @RequestBody UpdateUserReqDTO dto) throws InvalidException {

        UserResDTO updatedUser = userService.updateUser(dto);
        return ResponseEntity.ok(updatedUser);
    }

    @RequirePermission(resource = ResourceEnum.USER, action = ActionEnum.DELETE)
    @DeleteMapping("/{id}")
    @ApiMessage("User deleted")
    public ResponseEntity<Boolean> deleteUserById(@PathVariable("id") long id) throws InvalidException {
        boolean deleted = userService.deleteUserById(id);
        return ResponseEntity.ok(deleted);
    }

    @RequirePermission(resource = ResourceEnum.USER, action = ActionEnum.READ)
    @GetMapping("/{id}")
    @ApiMessage("Get user")
    public ResponseEntity<UserResDTO> getUserById(@PathVariable("id") long id) throws InvalidException {
        UserResDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @RequirePermission(resource = ResourceEnum.USER, action = ActionEnum.READ)
    @GetMapping("/users")
    @ApiMessage("Get users with filter")
    public ResponseEntity<PaginationResponse<UserResDTO>> getAllUser(
            @ParameterObject GetListUserReqDTO filter,
            @ParameterObject Pageable pageable) {

        PaginationResponse<UserResDTO> result = userService.getListUser(filter, pageable);
        return ResponseEntity.ok(result);
    }

}
