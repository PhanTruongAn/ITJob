package vn.phantruongan.backend.review.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.entities.User;
import vn.phantruongan.backend.authentication.repositories.UserRepository;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.company.entities.Company;
import vn.phantruongan.backend.company.repositories.CompanyRepository;
import vn.phantruongan.backend.review.dtos.req.CreateCompanyReviewReqDTO;
import vn.phantruongan.backend.review.dtos.req.UpdateCompanyReviewReqDTO;
import vn.phantruongan.backend.review.dtos.res.CompanyReviewResDTO;
import vn.phantruongan.backend.review.entities.CompanyReview;
import vn.phantruongan.backend.review.mappers.CompanyReviewMapper;
import vn.phantruongan.backend.review.repositories.CompanyReviewRepository;
import vn.phantruongan.backend.util.error.InvalidException;

@Service
@RequiredArgsConstructor
public class CompanyReviewService {

    private final CompanyReviewRepository companyReviewRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CompanyReviewMapper companyReviewMapper;

    // get all reviews with pagination
    public PaginationResponse<CompanyReviewResDTO> getAllReviewsByCompanyId(Long companyId, Pageable pageable) {
        Page<CompanyReview> page = companyReviewRepository.findAllByCompany_IdAndHiddenFalse(companyId, pageable);

        List<CompanyReviewResDTO> list = companyReviewMapper.toDtoList(page.getContent());

        PaginationResponse.Meta meta = new PaginationResponse.Meta(
                page.getNumber() + 1,
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());

        return new PaginationResponse<>(list, meta);
    }

    // create a new review
    public CompanyReviewResDTO createReview(CreateCompanyReviewReqDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new InvalidException("User not found"));

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new InvalidException("Company not found"));

        CompanyReview review = companyReviewMapper.toEntity(dto);

        review.setUser(user);
        review.setCompany(company);

        companyReviewRepository.save(review);

        return companyReviewMapper.toDto(review);
    }

    // update an existing review
    public CompanyReviewResDTO updateReview(UpdateCompanyReviewReqDTO dto) {
        CompanyReview review = companyReviewRepository.findById(dto.getId())
                .orElseThrow(() -> new InvalidException("Review not found"));

        companyReviewMapper.updateEntityFromDto(dto, review);

        companyReviewRepository.save(review);

        return companyReviewMapper.toDto(review);
    }

    // get a review by id
    public CompanyReviewResDTO getReview(Long id) {
        CompanyReview review = companyReviewRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Review not found"));

        return companyReviewMapper.toDto(review);
    }

    // delete a review
    public void deleteReview(Long id) {
        CompanyReview review = companyReviewRepository.findById(id)
                .orElseThrow(() -> new InvalidException("Review not found"));

        companyReviewRepository.delete(review);
    }

}
