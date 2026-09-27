package vn.phantruongan.backend.cvbuilder.services;

import java.util.List;

import vn.phantruongan.backend.cvbuilder.dtos.models.CvContentDTO;
import vn.phantruongan.backend.cvbuilder.dtos.models.CvThemeConfigDTO;
import vn.phantruongan.backend.cvbuilder.dtos.req.CreateCandidateCvReqDTO;
import vn.phantruongan.backend.cvbuilder.dtos.req.UpdateCandidateCvReqDTO;
import vn.phantruongan.backend.cvbuilder.dtos.res.CandidateCvResDTO;
import vn.phantruongan.backend.util.error.InvalidException;

public interface CandidateCvService {

    List<CandidateCvResDTO> getMyCvs() throws InvalidException;

    CandidateCvResDTO getCvById(Long id) throws InvalidException;

    CandidateCvResDTO createCv(CreateCandidateCvReqDTO dto) throws InvalidException;

    CandidateCvResDTO updateCv(Long id, UpdateCandidateCvReqDTO dto) throws InvalidException;

    void deleteCv(Long id) throws InvalidException;

    CandidateCvResDTO duplicateCv(Long id) throws InvalidException;

    CandidateCvResDTO setDefaultCv(Long id) throws InvalidException;

    CandidateCvResDTO syncPdfUrl(Long id, String pdfUrl, String thumbnailUrl) throws InvalidException;

    CandidateCvResDTO updateThemeConfig(Long id, CvThemeConfigDTO themeConfig) throws InvalidException;

    CandidateCvResDTO updateContent(Long id, CvContentDTO content) throws InvalidException;
}
