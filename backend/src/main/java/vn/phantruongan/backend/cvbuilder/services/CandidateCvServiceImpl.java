package vn.phantruongan.backend.cvbuilder.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.common.security.CurrentUserService;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvContentDTO;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvThemeConfigDTO;
import vn.phantruongan.backend.cvbuilder.dtos.req.CreateCandidateCvReqDTO;
import vn.phantruongan.backend.cvbuilder.dtos.req.UpdateCandidateCvReqDTO;
import vn.phantruongan.backend.cvbuilder.dtos.res.CandidateCvResDTO;
import vn.phantruongan.backend.cvbuilder.entities.CandidateCv;
import vn.phantruongan.backend.cvbuilder.mappers.CandidateCvMapper;
import vn.phantruongan.backend.cvbuilder.repositories.CandidateCvRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
@Slf4j
public class CandidateCvServiceImpl implements CandidateCvService {

    private final CandidateCvRepository candidateCvRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final CandidateCvMapper candidateCvMapper;

    // ─── Query ───────────────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<CandidateCvResDTO> getMyCvs() throws InvalidException {
        User user = getCurrentUser();
        return candidateCvMapper.toDtoList(
                candidateCvRepository.findByUserOrderByUpdatedAtDesc(user));
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateCvResDTO getCvById(Long id) throws InvalidException {
        User user = getCurrentUser();
        CandidateCv cv = findCvOfUser(id, user);
        return candidateCvMapper.toDto(cv);
    }

    // ─── Create ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public CandidateCvResDTO createCv(CreateCandidateCvReqDTO dto) throws InvalidException {
        User user = getCurrentUser();

        CandidateCv cv = new CandidateCv();
        cv.setUser(user);
        cv.setTitle(dto.getTitle());
        cv.setTemplateId(dto.getTemplateId() != null ? dto.getTemplateId() : "modern-it");
        cv.setThemeConfig(dto.getThemeConfig());
        cv.setContent(dto.getContent());

        long count = candidateCvRepository.countByUser(user);
        boolean shouldBeDefault = count == 0 || Boolean.TRUE.equals(dto.getIsDefault());
        if (shouldBeDefault) {
            resetCurrentDefault(user);
            cv.setDefault(true);
        }

        CandidateCv saved = candidateCvRepository.save(cv);
        log.info("User '{}' created CV '{}' (ID: {})", user.getEmail(), saved.getTitle(), saved.getId());
        return candidateCvMapper.toDto(saved);
    }

    // ─── Update ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public CandidateCvResDTO updateCv(Long id, UpdateCandidateCvReqDTO dto) throws InvalidException {
        User user = getCurrentUser();
        CandidateCv cv = findCvOfUser(id, user);

        if (dto.getTitle() != null && !dto.getTitle().isBlank()) {
            cv.setTitle(dto.getTitle());
        }
        if (dto.getTemplateId() != null) {
            cv.setTemplateId(dto.getTemplateId());
        }
        if (dto.getThemeConfig() != null) {
            cv.setThemeConfig(dto.getThemeConfig());
        }
        if (dto.getContent() != null) {
            cv.setContent(dto.getContent());
        }
        if (dto.getPdfUrl() != null) {
            cv.setPdfUrl(dto.getPdfUrl());
        }
        if (dto.getThumbnailUrl() != null) {
            cv.setThumbnailUrl(dto.getThumbnailUrl());
        }
        if (Boolean.TRUE.equals(dto.getIsDefault()) && !cv.isDefault()) {
            resetCurrentDefault(user);
            cv.setDefault(true);
        }

        CandidateCv updated = candidateCvRepository.save(cv);
        log.info("User '{}' updated CV ID: {}", user.getEmail(), updated.getId());
        return candidateCvMapper.toDto(updated);
    }

    @Override
    @Transactional
    public CandidateCvResDTO updateThemeConfig(Long id, CvThemeConfigDTO themeConfig) throws InvalidException {
        User user = getCurrentUser();
        CandidateCv cv = findCvOfUser(id, user);
        cv.setThemeConfig(themeConfig);
        return candidateCvMapper.toDto(candidateCvRepository.save(cv));
    }

    @Override
    @Transactional
    public CandidateCvResDTO updateContent(Long id, CvContentDTO content) throws InvalidException {
        User user = getCurrentUser();
        CandidateCv cv = findCvOfUser(id, user);
        cv.setContent(content);
        return candidateCvMapper.toDto(candidateCvRepository.save(cv));
    }

    // ─── Delete ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void deleteCv(Long id) throws InvalidException {
        User user = getCurrentUser();
        CandidateCv cv = findCvOfUser(id, user);
        boolean wasDefault = cv.isDefault();
        candidateCvRepository.delete(cv);
        log.info("User '{}' deleted CV ID: {}", user.getEmail(), id);

        if (wasDefault) {
            List<CandidateCv> remaining = candidateCvRepository.findByUserOrderByUpdatedAtDesc(user);
            if (!remaining.isEmpty()) {
                CandidateCv next = remaining.get(0);
                next.setDefault(true);
                candidateCvRepository.save(next);
            }
        }
    }

    // ─── Special Operations ──────────────────────────────────────────────────

    @Override
    @Transactional
    public CandidateCvResDTO duplicateCv(Long id) throws InvalidException {
        User user = getCurrentUser();
        CandidateCv original = findCvOfUser(id, user);

        CandidateCv copy = new CandidateCv();
        copy.setUser(user);
        copy.setTitle(original.getTitle() + " (Bản sao)");
        copy.setTemplateId(original.getTemplateId());
        // Copy raw JSON strings to preserve exact structure
        copy.setThemeConfigJson(original.getThemeConfigJson());
        copy.setContentJson(original.getContentJson());
        copy.setDefault(false);

        CandidateCv saved = candidateCvRepository.save(copy);
        log.info("User '{}' duplicated CV {} → new ID: {}", user.getEmail(), id, saved.getId());
        return candidateCvMapper.toDto(saved);
    }

    @Override
    @Transactional
    public CandidateCvResDTO setDefaultCv(Long id) throws InvalidException {
        User user = getCurrentUser();
        CandidateCv target = findCvOfUser(id, user);
        resetCurrentDefault(user);
        target.setDefault(true);
        CandidateCv updated = candidateCvRepository.save(target);
        log.info("User '{}' set CV ID {} as default", user.getEmail(), id);
        return candidateCvMapper.toDto(updated);
    }

    @Override
    @Transactional
    public CandidateCvResDTO syncPdfUrl(Long id, String pdfUrl, String thumbnailUrl) throws InvalidException {
        User user = getCurrentUser();
        CandidateCv cv = findCvOfUser(id, user);
        if (pdfUrl != null && !pdfUrl.isBlank()) cv.setPdfUrl(pdfUrl);
        if (thumbnailUrl != null && !thumbnailUrl.isBlank()) cv.setThumbnailUrl(thumbnailUrl);
        return candidateCvMapper.toDto(candidateCvRepository.save(cv));
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────

    private void resetCurrentDefault(User user) {
        Optional<CandidateCv> current = candidateCvRepository.findByUserAndIsDefaultTrue(user);
        if (current.isPresent()) {
            CandidateCv prev = current.get();
            prev.setDefault(false);
            candidateCvRepository.save(prev);
        }
    }

    private CandidateCv findCvOfUser(Long id, User user) throws InvalidException {
        return candidateCvRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new InvalidException("Không tìm thấy CV với ID: " + id));
    }

    private User getCurrentUser() throws InvalidException {
        String email = currentUserService.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidException("Không tìm thấy thông tin người dùng đang đăng nhập."));
    }
}
