package vn.phantruongan.backend.config.auth;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import vn.phantruongan.backend.config.ratelimit.RateLimitFilter;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http, CustomAuthenticationEntryPoint entryPoint, RateLimitFilter rateLimitFilter)
                        throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .cors(Customizer.withDefaults())
                                .addFilterBefore(rateLimitFilter, UsernamePasswordAuthenticationFilter.class)
                                .authorizeHttpRequests(authz -> authz
                                                .requestMatchers(
                                                                "/", "/api/v1/auth/login", "/api/v1/auth/refresh",
                                                                "/api/v1/auth/register",
                                                                "/api/v1/auth/verify-email",
                                                                "/api/v1/public/**",
                                                                "/api/v1/auth/google",
                                                                "/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html",
                                                                "/swagger-resources/**", "/webjars/**")
                                                .permitAll()
                                                .anyRequest().authenticated())
                                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())
                                                .authenticationEntryPoint(entryPoint))
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .formLogin(form -> form.disable());

                return http.build();
        }
}
