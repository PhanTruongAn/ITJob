package vn.phantruongan.backend.config.redis;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.SerializationException;

import vn.phantruongan.backend.job.dtos.res.JobResDTO;

class RedisConfigTest {
    @Test
    void serializerRoundTripsCachedDtoCollectionsAndJavaTimeValues() {
        RedisSerializer<Object> serializer = RedisConfig.createRedisSerializer();
        JobResDTO job = new JobResDTO();
        job.setId(42L);
        job.setName("Backend Engineer");
        job.setStartDate(Instant.parse("2026-01-02T03:04:05Z"));

        Object restored = serializer.deserialize(serializer.serialize(new ArrayList<>(List.of(job))));

        assertEquals(List.of(job), restored);
    }

    @Test
    void serializerRejectsTypesOutsideTheApplicationAndCollectionAllowlist() {
        RedisSerializer<Object> serializer = RedisConfig.createRedisSerializer();
        byte[] untrustedType = "{\"@class\":\"java.io.File\",\"path\":\"/tmp/x\"}"
                .getBytes(java.nio.charset.StandardCharsets.UTF_8);

        assertThrows(SerializationException.class, () -> serializer.deserialize(untrustedType));
    }
}
