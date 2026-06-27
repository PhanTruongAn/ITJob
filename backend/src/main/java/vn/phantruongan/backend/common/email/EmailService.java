package vn.phantruongan.backend.common.email;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.recommendation.dtos.res.JobRecommendationResDTO;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    /**
     * Gửi email xác nhận đăng ký tài khoản (async - không block luồng chính)
     */
    @Async
    public void sendVerifyEmail(String to, String name, String token) {
        try {
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("link", "http://localhost:3000/verify-email?token=" + token);

            String content = templateEngine.process("verify-email", context);

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, StandardCharsets.UTF_8.name());
            helper.setTo(to);
            helper.setFrom("ITJob <phanan1000@gmail.com>");
            helper.setSubject("Verify your email address - ITJob");
            helper.setText(content, true);

            javaMailSender.send(mimeMessage);
            log.info("Verification email sent to '{}'", to);
        } catch (MessagingException e) {
            log.error("Failed to send verification email to '{}': {}", to, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error sending verify email to '{}': {}", to, e.getMessage());
        }
    }

    /**
     * Gửi email danh sách việc làm gợi ý cho ứng viên (synchronous)
     */
    public void sendJobRecommendationsEmail(String to, String name, List<JobRecommendationResDTO> jobs) throws Exception {
        if (jobs == null || jobs.isEmpty()) {
            return;
        }
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("jobs", jobs);

        String content = templateEngine.process("job-recommendation", context);

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, false, StandardCharsets.UTF_8.name());
        helper.setTo(to);
        helper.setFrom("ITJob <phanan1000@gmail.com>");
        helper.setSubject("Gợi ý việc làm phù hợp dành riêng cho bạn - ITJob");
        helper.setText(content, true);

        javaMailSender.send(mimeMessage);

        log.info("Job recommendations email sent to '{}' with {} jobs", to, jobs.size());
    }
}
