package vn.phantruongan.backend.extenals.google;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;

import lombok.RequiredArgsConstructor;
import vn.phantruongan.backend.authentication.dtos.google.res.GoogleTokenInfoResDTO;
import vn.phantruongan.backend.config.AppConfig;

@Service
@RequiredArgsConstructor
public class GoogleAuthService {

    private final AppConfig appConfig;
    private static final NetHttpTransport TRANSPORT = new NetHttpTransport();
    private static final JacksonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();

    public GoogleTokenInfoResDTO verify(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(TRANSPORT, JSON_FACTORY)
                .setAudience(Collections.singletonList(appConfig.getGoogleClientId()))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            throw new BadCredentialsException("Invalid Google token");
        }

        Payload payload = idToken.getPayload();
        return new GoogleTokenInfoResDTO(
                payload.getSubject(),
                payload.getEmail(),
                (String) payload.get("name"),
                (String) payload.get("picture"));
    }
}
