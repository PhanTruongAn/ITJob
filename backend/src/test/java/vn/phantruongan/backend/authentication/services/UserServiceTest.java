package vn.phantruongan.backend.authentication.services;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import vn.phantruongan.backend.authentication.dtos.req.CreateUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.req.UpdateUserReqDTO;
import vn.phantruongan.backend.authentication.dtos.res.UserResDTO;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.mappers.UserMapper;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.authorization.entities.Role;
import vn.phantruongan.backend.authorization.repositories.RoleRepository;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.util.error.InvalidException;
import vn.phantruongan.backend.util.error.PermissionDeniedException;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserMapper userMapper;
    @Mock
    private CurrentUserService currentUserService;

    @InjectMocks
    private UserService userService;

    private User admin;
    private Role candidateRole;

    @BeforeEach
    void setUp() {
        admin = userWithRole("ADMIN");
        candidateRole = role("CANDIDATE", true);
    }

    @Test
    void createsUserWithAnExistingActiveAssignableRole() throws Exception {
        stubCurrentActor(admin);
        CreateUserReqDTO request = createRequest(10L);
        User mapped = new User();
        UserResDTO response = new UserResDTO();
        when(roleRepository.findById(10L)).thenReturn(Optional.of(candidateRole));
        when(userMapper.toEntity(request)).thenReturn(mapped);
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(userRepository.existsByPhoneAndDeletedAtIsNull(request.getPhone())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded-password");
        when(userRepository.save(mapped)).thenReturn(mapped);
        when(userMapper.toDto(mapped)).thenReturn(response);

        assertEquals(response, userService.createUser(request));
        assertEquals(candidateRole, mapped.getRole());
        assertEquals("encoded-password", mapped.getPassword());
        verify(userRepository).save(mapped);
    }

    @Test
    void rejectsMissingOrInactiveRole() {
        stubCurrentActor(admin);
        CreateUserReqDTO request = createRequest(10L);
        when(roleRepository.findById(10L)).thenReturn(Optional.empty());
        assertThrows(InvalidException.class, () -> userService.createUser(request));

        Role inactiveRole = role("CANDIDATE", false);
        when(roleRepository.findById(11L)).thenReturn(Optional.of(inactiveRole));
        assertThrows(InvalidException.class, () -> userService.createUser(createRequest(11L)));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void managerCannotAssignAdministrativeRoleEvenWhenRequestSuppliesItsId() {
        User manager = userWithRole("MANAGER");
        Role adminRole = role("ADMIN", true);
        stubCurrentActor(manager);
        when(roleRepository.findById(10L)).thenReturn(Optional.of(adminRole));

        assertThrows(PermissionDeniedException.class,
                () -> userService.createUser(createRequest(10L)));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void managerCanAssignOrdinaryCandidateOrEmployerRole() throws Exception {
        User manager = userWithRole("MANAGER");
        stubCurrentActor(manager);
        when(roleRepository.findById(10L)).thenReturn(Optional.of(candidateRole));
        User mapped = new User();
        when(userMapper.toEntity(any(CreateUserReqDTO.class))).thenReturn(mapped);
        when(userRepository.existsByEmail("new@example.test")).thenReturn(false);
        when(userRepository.existsByPhoneAndDeletedAtIsNull("0123456789")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encoded");
        when(userRepository.save(mapped)).thenReturn(mapped);
        when(userMapper.toDto(mapped)).thenReturn(new UserResDTO());

        userService.createUser(createRequest(10L));

        assertEquals(candidateRole, mapped.getRole());
        verify(userRepository).save(mapped);
    }

    @Test
    void updateAllowsKeepingOwnPhoneAndChangingToUnusedPhone() throws Exception {
        User existing = userWithRole("CANDIDATE");
        existing.setId(4L);
        existing.setPhone("0123456789");
        when(userRepository.findById(4L)).thenReturn(Optional.of(existing));
        when(userRepository.existsByPhoneAndDeletedAtIsNullAndIdNot("0123456789", 4L)).thenReturn(false);
        when(userRepository.existsByPhoneAndDeletedAtIsNullAndIdNot("0987654321", 4L)).thenReturn(false);
        when(userRepository.save(existing)).thenReturn(existing);
        when(userMapper.toDto(existing)).thenReturn(new UserResDTO());

        userService.updateUser(updateRequest(4L, "0123456789"));
        userService.updateUser(updateRequest(4L, "0987654321"));

        verify(userRepository).existsByPhoneAndDeletedAtIsNullAndIdNot("0123456789", 4L);
        verify(userRepository).existsByPhoneAndDeletedAtIsNullAndIdNot("0987654321", 4L);
    }

    @Test
    void updateRejectsPhoneAlreadyOwnedByAnotherUser() {
        User existing = userWithRole("CANDIDATE");
        existing.setId(4L);
        when(userRepository.findById(4L)).thenReturn(Optional.of(existing));
        when(userRepository.existsByPhoneAndDeletedAtIsNullAndIdNot("0987654321", 4L)).thenReturn(true);

        assertThrows(InvalidException.class,
                () -> userService.updateUser(updateRequest(4L, "0987654321")));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void rejectsSelfDeletionForAnAuthenticatedCandidate() {
        User candidate = userWithRole("CANDIDATE");
        candidate.setId(4L);
        User loadedTarget = userWithRole("CANDIDATE");
        loadedTarget.setId(4L);
        when(currentUserService.getCurrentUserEmail()).thenReturn("candidate@example.test");
        when(userRepository.findByEmail("candidate@example.test")).thenReturn(Optional.of(candidate));
        when(userRepository.findById(4L)).thenReturn(Optional.of(loadedTarget));

        assertThrows(PermissionDeniedException.class, () -> userService.deleteUserById(4L));
        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    void preventsDeletingTheLastActiveAdmin() {
        User manager = userWithRole("MANAGER");
        User targetAdmin = userWithRole("ADMIN");
        targetAdmin.setId(9L);
        Role adminRole = targetAdmin.getRole();
        stubCurrentActor(manager);
        when(userRepository.findById(9L)).thenReturn(Optional.of(targetAdmin));
        when(roleRepository.findByNameForUpdate("ADMIN")).thenReturn(Optional.of(adminRole));
        when(userRepository.countActiveUsersByRoleName("ADMIN")).thenReturn(1L);

        assertThrows(InvalidException.class, () -> userService.deleteUserById(9L));

        InOrder order = inOrder(roleRepository, userRepository);
        order.verify(roleRepository).findByNameForUpdate("ADMIN");
        order.verify(userRepository).countActiveUsersByRoleName("ADMIN");
        verify(userRepository, never()).delete(any(User.class));
    }

    @Test
    void permitsDeletingAnAdminWhenAnotherActiveAdminRemains() throws Exception {
        User firstAdmin = userWithRole("ADMIN");
        User secondAdmin = userWithRole("ADMIN");
        secondAdmin.setId(9L);
        stubCurrentActor(firstAdmin);
        when(userRepository.findById(9L)).thenReturn(Optional.of(secondAdmin));
        when(roleRepository.findByNameForUpdate("ADMIN")).thenReturn(Optional.of(secondAdmin.getRole()));
        when(userRepository.countActiveUsersByRoleName("ADMIN")).thenReturn(2L);

        assertEquals(true, userService.deleteUserById(9L));

        verify(userRepository).delete(secondAdmin);
    }

    private CreateUserReqDTO createRequest(Long roleId) {
        CreateUserReqDTO request = new CreateUserReqDTO();
        request.setName("New user");
        request.setEmail("new@example.test");
        request.setPhone("0123456789");
        request.setPassword("password");
        request.setRoleId(roleId);
        return request;
    }

    private void stubCurrentActor(User actor) {
        when(currentUserService.getCurrentUserEmail()).thenReturn("admin@example.test");
        when(userRepository.findByEmail("admin@example.test")).thenReturn(Optional.of(actor));
    }

    private UpdateUserReqDTO updateRequest(Long id, String phone) {
        UpdateUserReqDTO request = new UpdateUserReqDTO();
        request.setId(id);
        request.setName("Updated");
        request.setPhone(phone);
        return request;
    }

    private User userWithRole(String roleName) {
        User user = new User();
        user.setRole(role(roleName, true));
        return user;
    }

    private Role role(String name, boolean active) {
        Role role = new Role();
        role.setName(name);
        role.setActive(active);
        return role;
    }
}
