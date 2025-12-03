package vn.phantruongan.backend.subscriber.controllers;

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
import vn.phantruongan.backend.authorization.enums.ActionEnum;
import vn.phantruongan.backend.authorization.enums.ResourceEnum;
import vn.phantruongan.backend.common.dtos.PaginationResponse;
import vn.phantruongan.backend.config.web.ApiPaths;
import vn.phantruongan.backend.subscriber.dtos.req.subscriber.CreateSubscriberReqDTO;
import vn.phantruongan.backend.subscriber.dtos.req.subscriber.GetListSubscriberReqDTO;
import vn.phantruongan.backend.subscriber.dtos.req.subscriber.UpdateSubscriberReqDTO;
import vn.phantruongan.backend.subscriber.dtos.res.SubscriberResDTO;
import vn.phantruongan.backend.subscriber.services.SubscriberService;
import vn.phantruongan.backend.util.annotations.ApiMessage;
import vn.phantruongan.backend.util.annotations.RequirePermission;
import vn.phantruongan.backend.util.error.InvalidException;

@RestController
@RequestMapping(ApiPaths.SUBSCRIBERS)
@Tag(name = "Subscriber Controller", description = "Quản lý đăng ký kỹ năng")
@RequiredArgsConstructor
public class SubscriberController {
    private final SubscriberService subscriberService;

    @RequirePermission(resource = ResourceEnum.SUBSCRIBER, action = ActionEnum.READ)
    @GetMapping()
    @ApiMessage("Get list subscriber with filter")
    public ResponseEntity<PaginationResponse<SubscriberResDTO>> getAllSubscribers(
            @ParameterObject GetListSubscriberReqDTO dto,
            @ParameterObject Pageable pageable) {

        PaginationResponse<SubscriberResDTO> result = subscriberService.getAllSubscribers(dto, pageable);
        return ResponseEntity.ok(result);
    }

    @RequirePermission(resource = ResourceEnum.SUBSCRIBER, action = ActionEnum.CREATE)
    @PostMapping()
    @ApiMessage("Create new subscriber")
    public ResponseEntity<SubscriberResDTO> createSubscriber(@Valid @RequestBody CreateSubscriberReqDTO dto)
            throws InvalidException {

        SubscriberResDTO newSubscriber = subscriberService.createSubscriber(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newSubscriber);

    }

    @RequirePermission(resource = ResourceEnum.SUBSCRIBER, action = ActionEnum.UPDATE)
    @PutMapping()
    @ApiMessage("Subscriber updated")
    public ResponseEntity<SubscriberResDTO> updateSubscriber(@Valid @RequestBody UpdateSubscriberReqDTO dto)
            throws InvalidException {

        SubscriberResDTO subscriberUpdated = subscriberService.updateSubscriber(dto);
        return ResponseEntity.ok(subscriberUpdated);
    }

    @RequirePermission(resource = ResourceEnum.SUBSCRIBER, action = ActionEnum.READ)
    @GetMapping("/{id}")
    @ApiMessage("Get subscriber by id")
    public ResponseEntity<SubscriberResDTO> findSubscriberById(@PathVariable("id") long id) throws InvalidException {
        SubscriberResDTO subscriber = subscriberService.findById(id);
        return ResponseEntity.ok(subscriber);
    }

    @RequirePermission(resource = ResourceEnum.SUBSCRIBER, action = ActionEnum.DELETE)
    @DeleteMapping("/{id}")
    @ApiMessage("Subscriber deleted")
    public ResponseEntity<Boolean> deleteSubscriber(@PathVariable("id") long id) throws InvalidException {
        boolean isDelete = subscriberService.deleteSubscriberById(id);
        return ResponseEntity.ok(isDelete);

    }
}
