package vn.phantruongan.backend.initialization;

import java.util.Locale;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.phantruongan.backend.company.entities.Country;
import vn.phantruongan.backend.company.repositories.CountryRepository;

@Component
@Order(1)
@Slf4j
@RequiredArgsConstructor
public class CountryDataInitializer {

    private final CountryRepository countryRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void initCountries() {

        if (countryRepository.count() > 0) {
            log.info("Country đã được khởi tạo trước đó → BỎ QUA việc seed lại");
            return;
        }

        log.info("Bắt đầu seed dữ liệu Country từ ISO...");

        long countBefore = countryRepository.count();
        int inserted = 0;

        for (String code : Locale.getISOCountries()) {
            if (countryRepository.existsByCode(code)) {
                continue;
            }

            Locale locale = new Locale("", code);
            String name = locale.getDisplayCountry(Locale.ENGLISH);

            if (!name.isBlank()) {
                Country country = new Country();
                country.setCode(code);
                country.setName(name);
                countryRepository.save(country);
                inserted++;
            }
        }

        log.info("Hoàn thành seed Country: +{} bản ghi (tổng: {})",
                inserted, countBefore + inserted);

    }
}