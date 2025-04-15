package vn.phantruongan.backend;

import java.util.Locale;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import vn.phantruongan.backend.domain.Country;
import vn.phantruongan.backend.repository.CountryRepository;

//disable security
// @SpringBootApplication(exclude = {
// 		org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
// 		org.springframework.boot.actuate.autoconfigure.security.servlet.ManagementWebSecurityAutoConfiguration.class
// })

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	// @Bean
	CommandLineRunner seedCountries(CountryRepository countryRepository) {
		return args -> {
			String[] isoCountries = Locale.getISOCountries();

			for (String code : isoCountries) {
				Locale locale = new Locale("", code);
				String name = locale.getDisplayCountry(Locale.ENGLISH);

				if (!name.isEmpty() && !countryRepository.existsByCode(code)) {
					Country country = new Country();
					country.setCode(code);
					country.setName(name);
					countryRepository.save(country);
				}
			}
		};
	}

}
