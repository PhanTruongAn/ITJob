package vn.phantruongan.backend.publics.profile.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.res.UserResDTO;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.publics.profile.dtos.req.PublicUpdateProfileReqDTO;
import vn.phantruongan.backend.publics.profile.services.PublicProfileService;
import vn.phantruongan.backend.util.annotations.ApiMessage;

@RestController
@RequestMapping(ApiPaths.PUBLIC_PROFILES)
@Tag(name = "Public Profile Controller", description = "Quản lý hồ sơ công khai")
@RequiredArgsConstructor
public class PublicProfileController {
    private final PublicProfileService service;

    @PutMapping()
    @ApiMessage("Profile updated")
    public ResponseEntity<UserResDTO> updateProfile(@RequestBody PublicUpdateProfileReqDTO dto) {
        return ResponseEntity.ok(service.updateProfile(dto));
    }

}
