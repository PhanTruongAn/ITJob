package vn.phantruongan.backend.profile.controllers;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.res.UserResDTO;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.profile.dtos.req.ChangePasswordReqDTO;
import vn.phantruongan.backend.profile.dtos.req.UpdateProfileReqDTO;
import vn.phantruongan.backend.profile.services.ProfileService;
import vn.phantruongan.backend.util.annotations.ApiMessage;

@RestController
@RequestMapping(ApiPaths.PROFILE)
@Tag(name = "Profile Controller", description = "Quản lý thông tin cá nhân")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping()
    @ApiMessage("Profile retrieved")
    public ResponseEntity<Optional<UserResDTO>> getProfile() {
        return ResponseEntity.ok(profileService.getUserProfile());
    }

    @PutMapping()
    @ApiMessage("Profile updated")
    public ResponseEntity<UserResDTO> updateProfile(@RequestBody UpdateProfileReqDTO dto) {
        return ResponseEntity.ok(profileService.updateProfile(dto));
    }

    @PutMapping("/change-password")
    @ApiMessage("Password changed")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordReqDTO dto) {
        profileService.changePassword(dto);
        return ResponseEntity.ok().build();
    }

}
